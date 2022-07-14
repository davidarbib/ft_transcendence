import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { MatchesService } from 'src/matches/matches.service';
import { Match } from 'src/matches/entities/match.entity';
import { PlayersService } from 'src/players/players.service';
import { myDataSource } from 'src/app-data-source';
import { Player } from 'src/players/entities/player.entity';
import { Game } from 'src/games/game/game';
import { Socket } from 'socket.io';
import { GameState } from './game/gameState';
import { randomUUID } from 'crypto';
import { UsersGateway } from 'src/users/users.gateway';

export interface UserSocket
{
  user: User,
  socket: Socket, 
}

@Injectable()
export class GamesService {
  constructor
  (
    private readonly matchesService : MatchesService,
    private readonly playersService : PlayersService,
    private readonly usersGateway: UsersGateway,
  )
  { }

  games : Map<string, Game> = new Map();
  invitUser : Map<string, string> = new Map();
  userInvit : Map<string, string> = new Map();
  hostSocket : Map<string, Socket> = new Map();
  userWhoWaitMatch : UserSocket[] = [];

  async create(user1: User, user2: User) {
    console.log("user1 : ");
    console.log(user1);
    console.log("user2 : ");
    console.log(user2);
    const match = await this.matchesService.create();
    const player1 = await this.playersService.create(user1, match);
    const player2 = await this.playersService.create(user2, match);

    await this.matchesService.init(match, player1, player2);
    return {match: match, playerOneId: player1.id, playerTwoId: player2.id};
  }

  userWaiting(user:User, socket: Socket)
  {
    console.log("user wait");
    this.userWhoWaitMatch.push({ user: user, socket: socket });
  }

  userStopWaiting(user:User)
  {
    let index:number = 0;
    this.userWhoWaitMatch.forEach(element => {
      if (element.user.id == user.id) {
        this.userWhoWaitMatch.splice(index);
        return;
      }
      index++;
    });
  }

  async matchmaking()
  {
    if (this.userWhoWaitMatch.length >= 2) {
      const { match, playerOneId, playerTwoId } =
        await this.create(this.userWhoWaitMatch[0].user, this.userWhoWaitMatch[1].user);
      const clients = {
        clientOne: this.userWhoWaitMatch[0].socket,
        clientTwo: this.userWhoWaitMatch[1].socket,
      }
      const user1 : User = this.userWhoWaitMatch[0].user;
      const user2 : User = this.userWhoWaitMatch[1].user;
      this.userWhoWaitMatch.splice(1);
      this.userWhoWaitMatch.splice(0);
      return { 
        match,
        clients,
        playerOneId,
        playerTwoId,
        playerOneUserRef: user1,
        playerTwoUserRef: user2,
      };
    }
    return {
      match: null,
      clients: null,
      playerOneId: null,
      playerTwoId: null,
      playerOneName: null,
      playerTwoName: null,
      playerOneUserRef: null,
      playerTwoUserRef: null,
    };
  }

  async findOne(id: string) {
    const arr = await myDataSource.getRepository(Player).find({relations: ['userRef']});
      arr.forEach(element  => {
        if (element.userRef.id == id)
          return element.matchRef;
      })
  }

  setReady(gameId: string, playerId: string) {
    this.games.get(gameId).setReady(playerId);
  }

  arePlayersReady(gameId: string): boolean {
    return this.games.get(gameId).arePlayersReady();
  }

  doGameExist(gameId: string): boolean {
    return this.games.has(gameId);
  }

  getGame(gameId: string) : Game
  {
    return this.games.get(gameId);
  }

  getState(gameId: string) : GameState
  {
    return this.games.get(gameId).getState();
  }

  getPlayerOneName(gameId: string) : string
  {
    return this.getState(gameId).player1.name;
  }

  getPlayerTwoName(gameId: string) : string
  {
    return this.getState(gameId).player2.name;
  }

  createGame
  (
    gameId: string,
    playerOneId: string,
    playerOneName: string,
    playerTwoId: string,
    playerTwoName: string,
  )
  {
    let game : Game = new Game(
      gameId,
      playerOneId,
      playerOneName,
      playerTwoId,
      playerTwoName,
      undefined,
      undefined,
      undefined,
    );
    this.games.set(gameId, game);
  }

  async getGamePlayedByUser(userId: string) : Promise<string>
  {
    const gameRequest = myDataSource
    .createQueryBuilder()
    .select("match")
    .from(Match, "match")
    .innerJoin(Player, "player", "player.matchRef = match.id")
    .where("match.active = :active", { 'active': true })
    .andWhere("player.userRef = :userId", { 'userId': userId });
    
    const match : Match = await gameRequest.getOne();
    if (!match)
      throw("game not found");
    return match.id;
  }

  addInvite(userId: string, client: Socket) : string
  {
    this.hostSocket.set(userId, client);
    const uuid : string = randomUUID();
    this.invitUser.set(uuid, userId);
    this.userInvit.set(userId, uuid);
    console.log(`hostId: ${userId}`)
    return uuid;
  }

  delInvite(userId: string)
  {
    const uuid = this.userInvit.get(userId);
    this.userInvit.delete(userId);
    this.invitUser.delete(uuid);
    this.hostSocket.delete(userId);
  }

  isAlreadyInviting(userId: string) : boolean
  {
    return (this.userInvit.has(userId));
  }

  doesInvitExist(inviteId: string) : boolean
  {
    return (this.invitUser.has(inviteId));
  }

  getInvitHost(inviteId: string) : string
  {
    return (this.invitUser.get(inviteId));
  }

  getHostSocket(userId: string)
  {
    return (this.hostSocket.get(userId));
  }

  setIngameStatus(userId: string)
  {
    this.usersGateway.handleStatusSwitch(userId, UserStatus.INGAME);
  }

  setSpectateStatus(userId: string)
  {
    this.usersGateway.handleStatusSwitch(userId, UserStatus.SPECTATE);
  }

  setEndGameStatus(userId: string)
  {
    this.usersGateway.handleStatusSwitch(userId, UserStatus.ONLINE);
  }
}
