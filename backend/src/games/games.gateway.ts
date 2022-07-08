import { OnEvent } from '@nestjs/event-emitter'
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { MatchesService } from 'src/matches/matches.service';
import { Match } from 'src/matches/entities/match.entity';
import { myDataSource } from 'src/app-data-source';
import { User } from 'src/users/entities/user.entity';
import { Player } from 'src/players/entities/player.entity';
import { PlayersService } from 'src/players/players.service';
import { ScoreEvent, GameFinishEvent} from 'src/games/game/game.event';
import { UsersService } from 'src/users/users.service';
import { LoopDetails, PadCmd } from './game/game';
import { Repository } from 'typeorm';

interface GameReadyPayload
{
  gameId: string,
  playerId: string,
  isP1: boolean,
    
}

interface GameStatePayload
{
  gameId: string,
  playerOneY: number,
  playerTwoY: number,
  ballX: number,
  ballY: number,
}

interface EndGamePayload
{
  gameId: string,
  didPlayerOneWin: boolean,
}

@WebSocketGateway({
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  }
})
export class GamesGateway {

  @WebSocketServer()
  server : Server;

  constructor
  (
    private readonly gamesService: GamesService,
    private readonly playerService : PlayersService,
    private readonly matchesService : MatchesService,
    private readonly usersService : UsersService,
    private readonly userRepo: Repository<User>,
  )
  { }

  @SubscribeMessage('findOneGame') // return the matches
  async findOne(@MessageBody() id: string) {
    return await this.gamesService.findOne(id);
  }

  /*
  @SubscribeMessage('findAllGames')
  findAll() {
    return this.gamesService.findAll();
  }*/

  //@SubscribeMessage('createGame')
  //async create
  //(
  //  @MessageBody('player1') user: User,
  //  @MessageBody('player2') user1: User
  //)
  //{
  // return this.gamesService.create(user, user1);
  //}

  @SubscribeMessage('joinMM')
  async userWaiting
  (
    @MessageBody('user') usr:User,
    @ConnectedSocket() client: Socket
  )
  {
    console.log('try to join');

    this.gamesService.userWaiting(usr, client);
    const { match, clients, playerOneId, playerTwoId } =
      await this.gamesService.matchmaking()
    if (match)
    {
      console.log("match created");
      this.gamesService.createGame(
        match.id,
        playerOneId,
        playerTwoId,
      )

      let payload : GameReadyPayload = {
        gameId: match.id,
        playerId: playerOneId,
        isP1: true,
      };
      clients.clientOne.emit("gameReady", payload);
      
      payload = {
        gameId: match.id,
        playerId: playerTwoId,
        isP1: false,
      }
      clients.clientTwo.emit("gameReady", payload);
    };
  }

  @SubscribeMessage('quitMM')
  userStopWaiting(@MessageBody('user') usr:User) {
    return this.gamesService.userStopWaiting(usr);
  }

  @SubscribeMessage('leaveGame')
  async leave
  (
    @MessageBody('gameId') gameId: string,
    @MessageBody('playerId') playerId: string,
    @ConnectedSocket() client: Socket,
  )
  {
    client.leave(gameId);
  }

  @SubscribeMessage('canvasReady')
  async ready
  (
    @MessageBody('gameId') gameId: string,
    @MessageBody('playerId') playerId: string,
    @ConnectedSocket() client: Socket,
  )
  {
    //TODO security
    client.join(gameId);
    this.gamesService.setReady(gameId, playerId);
    if (this.gamesService.arePlayersReady(gameId))
      this.gameLoop(gameId);
  }

  @SubscribeMessage('spectate')
  async spectate
  (
    @MessageBody('gameId') gameId: string,
    @ConnectedSocket() client: Socket,
  )
  {
    client.join(gameId);
  }

  @SubscribeMessage('endSpectate')
  async endSpectate 
  (
    @MessageBody('gameId') gameId: string,
    @ConnectedSocket() client: Socket,
  )
  {
    client.leave(gameId);
  }

  @SubscribeMessage('padUp')
  async padUp
  (
    @MessageBody('gameId') gameId: string,
    @MessageBody('playerId') playerId: string,
  )
  {
    console.log("move up");
    this.gamesService.getGame(gameId).movePad(playerId, PadCmd.UP);
  }

  @SubscribeMessage('padDown')
  async padDown
  (
    @MessageBody('gameId') gameId: string,
    @MessageBody('playerId') playerId: string,
  )
  {
    console.log("move down");
    this.gamesService.getGame(gameId).movePad(playerId, PadCmd.DOWN);
  }

  @SubscribeMessage('createInvite')
  createInvite
  (
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  )
  {
    if (this.gamesService.isAlreadyInviting(userId))
      client.emit("inviteImpossible");
    else
    {
      const uuid = this.gamesService.addInvit(userId, client);
      client.emit("inviteCreated", uuid);
      console.log(`inviteId : ${uuid}`);
    }
  }

  @SubscribeMessage('acceptInvite')
  async acceptInvite
  (
    @MessageBody('userId') userId: string,
    @MessageBody('inviteId') inviteId: string,
    @ConnectedSocket() client: Socket,
  )
  {
    if (!this.gamesService.doesInvitExist(inviteId))
      client.emit("inviteNotFound");
    else
    {
      console.log("invite found");
      const hostId = this.gamesService.getInvitHost(inviteId);
      let hostSocket : Socket = this.gamesService.getHostSocket(hostId)
      let user1, user2 : User;
      user1 = await this.usersService.findOne(hostId);
      user2 = await this.usersService.findOne(userId);
      this.gamesService.create(user1, user2)
      .then(({ match, playerOneId, playerTwoId }) => {
        this.gamesService.createGame(match.id, playerOneId, playerTwoId);
        console.log("game created by invite");
        let payload : GameReadyPayload = {
          gameId: match.id,
          playerId: playerOneId,
          isP1: true,
        }
        hostSocket.emit("gameReady", payload);
        payload = {
          gameId: match.id,
          playerId: playerTwoId,
          isP1: false,
        }
        client.emit("gameReady", payload);
      })
      .catch(() => {
        console.log("problem in match creation");
      });
    }
  }

 // @OnEvent('score' , {async: true})
 // async handlePoint(payload: ScoreEvent)
 // {
 //   console.log('score event');
 //   const player = await myDataSource.getRepository(Player).findOne({where : { id : payload.playerId}})
 //   this.playerService.incrementScore(player);
 //   this.server.to(payload.gameId).emit('score', payload.p1);
 // }

  async handlePoint(gameId: string, playerId: string, isP1: boolean)
  {
    console.log('handle point');
    const player = await myDataSource.getRepository(Player).findOne({where : { id : playerId}})
    this.playerService.incrementScore(player);
    this.server.to(gameId).emit('score', isP1);
  }

  //@OnEvent('game_finished' , {async: true} )
  //async handlefinishGame(payload: GameFinishEvent)
  //{
  //  let endPayload : EndGamePayload;
  //  endPayload.gameId = payload.gameId;
  //  endPayload.didPlayerOneWin = payload.didPlayerOneWin;
  //  this.server.to(payload.gameId).emit("endGame", endPayload);

  //  const match = await this.matchesService.findOne(payload.gameId);
  //  const winner = await this.playerService.findOne(payload.winnerId);
  //  const loser = await this.playerService.findOne(payload.loserId);
  //  this.matchesService.finish(match);
  //  this.playerService.setWinner(winner);
  //  let usr:User = winner.userRef;
  //  usr.winCount++;
  //  myDataSource.getRepository(User).save(usr); 
  //  usr = loser.userRef;
  //  usr.lossCount++;
  //  myDataSource.getRepository(User).save(usr); 
  //}

  async handleFinishGame
  (
    gameId: string,
    winnerId: string,
    loserId: string,
    isP1Win: boolean,
  )
  {
    console.log("endGame back");
    let endPayload : EndGamePayload = 
    {
      gameId: gameId,
      didPlayerOneWin: isP1Win,
    };
    this.server.to(gameId).emit("endGame", endPayload);

    const match = await this.matchesService.findOne(gameId);
    const winner : Player = await this.playerService.findOne(winnerId);
    const loser = await this.playerService.findOne(loserId);
    this.matchesService.finish(match);
    this.playerService.setWinner(winner);
    let user:User = winner.userRef;
    user.winCount++;
    myDataSource.getRepository(User).save(user); 
    user = loser.userRef;
    user.lossCount++;
    myDataSource.getRepository(User).save(user); 
  }
  
  async handleLoopOutput(gameId: string, details: LoopDetails)
  {
    let loopPayload: GameStatePayload;
    const gameState = this.gamesService.getGame(gameId).getState();
    //console.log("ball positions just before emit:");
    //console.log(gameState.ball.xPos);
    //console.log(gameState.ball.yPos);
    loopPayload = {
      gameId: gameId,
      playerOneY: gameState.player1.yPos,
      playerTwoY: gameState.player2.yPos,
      ballX: gameState.ball.xPos,
      ballY: gameState.ball.yPos,
    }
    this.server.to(gameId).emit("gameState", loopPayload);
    if (details.score)
    {
      console.log(`isP1score : ${details.isP1Score}`);
      let playerId : string;
      if (details.isP1Score)
        playerId = gameState.player1.id;
      else
        playerId = gameState.player2.id;
      this.handlePoint(gameId, playerId, details.isP1Score);
    }
  }

  async gameLoop(gameId: string)
  {
    let gameClock = setInterval(() => {
      const { endGame, details } = this.gamesService.games[gameId].loop();
      if (!endGame)
        this.handleLoopOutput(gameId, details)
      else
      {
        clearInterval(gameClock);
        const { score, isP1Score, win, isP1Win} = details;
        let playerOneId : string = this.gamesService.getState(gameId).player1.id;
        let playerTwoId : string = this.gamesService.getState(gameId).player2.id;
        let winnerId, loserId : string;
        if (isP1Win)
        {
          winnerId = playerOneId;
          loserId = playerTwoId;
        }
        else
        {
          winnerId = playerTwoId;
          loserId = playerOneId;
        }
        this.handleFinishGame(gameId, winnerId, loserId, isP1Win);
        this.server.in(gameId).socketsLeave(gameId);
      }
    //}, 10); //~90fps for debugging
    }, 33); //~30fps
    //}, 10000); //slow for debugging
  }
}
