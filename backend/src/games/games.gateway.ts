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
import { PadCmd } from './game/game';

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

  @SubscribeMessage('createGame')
  async create
  (
    @MessageBody('player1') user: User,
    @MessageBody('player2') user1: User
  )
  {
   return this.gamesService.create(user, user1);
  }

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
      this.gamesService.createMMGame(
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
    this.gamesService.games[gameId].setReady(playerId);
    if (this.gamesService.games[gameId].arePlayersReady())
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

  @SubscribeMessage('movePad')
  async movePad
  (
    @MessageBody('gameId') gameId: string,
    @MessageBody('playerId') playerId: string,
    @MessageBody('cmd') cmd: PadCmd,
  )
  {
    this.gamesService.getGame(gameId).movePad(playerId, cmd);
  }

  @OnEvent('score' , {async: true})
  async handlePoint(payload: ScoreEvent)
  {
    const player = await myDataSource.getRepository(Player).findOne({where : { id : payload.playerId}})
    this.playerService.incrementScore(player);
    this.server.to(payload.gameId).emit('score', payload.p1);
  }

  @OnEvent('game_finished' , {async: true} )
  async handlefinishGame(payload: GameFinishEvent)
  {
    let endPayload : EndGamePayload;
    endPayload.gameId = payload.gameId;
    endPayload.didPlayerOneWin = payload.didPlayerOneWin;
    this.server.to(payload.gameId).emit("endGame", endPayload);

    const match = await this.matchesService.findOne(payload.gameId);
    const winner = await this.playerService.findOne(payload.winnerId);
    const loser = await this.playerService.findOne(payload.loserId);
    this.matchesService.finish(match);
    this.playerService.setWinner(winner);
    let usr:User = winner.userRef;
    usr.winCount++;
    myDataSource.getRepository(User).save(usr); 
    usr = loser.userRef;
    usr.lossCount++;
    myDataSource.getRepository(User).save(usr); 
  }

  async gameLoop(gameId: string)
  {
    let gameClock = setInterval(() => {
      let ret = this.gamesService.games[gameId].loop();
      if (!ret)
      {
        let loopPayload: GameStatePayload;
        const gameState = this.gamesService.getGame(gameId).getState();
        loopPayload.gameId = gameId;
        loopPayload.playerOneY = gameState.player1.yPos;
        loopPayload.playerTwoY = gameState.player2.yPos;
        loopPayload.ballX = gameState.ball.xPos;
        loopPayload.ballY = gameState.ball.yPos;
        this.server.to(gameId).emit("gameState", loopPayload);
      }
      else
      {
        clearInterval(gameClock);
        this.server.in(gameId).socketsLeave(gameId);
      }
    }, 33); //30fps
  }
}
