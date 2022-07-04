import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { User } from 'src/users/entities/user.entity';
import { MatchesService } from 'src/matches/matches.service';
import { Match } from 'src/matches/entities/match.entity';
import { PlayersService } from 'src/players/players.service';
import { myDataSource } from 'src/app-data-source';
import { Player } from 'src/players/entities/player.entity';
import { Game } from 'src/games/game/game';
import { Socket } from 'socket.io';

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
    public games: Map<string, Game>,
  )
  {
    games = new Map();
  }

  userWhoWaitMatch : UserSocket[] = [];

  async create(user: User, user1 :User) {
    const match = await this.matchesService.create();
    const player = await this.playersService.create(user, match);
    const player1 = await this.playersService.create(user1, match);
    return await this.matchesService.init(match, player, player1);
  }

  userWaiting(user:User, socket: Socket)
  {
    this.userWhoWaitMatch.push({ user: user, socket: socket });
  }

  userStopWaiting(user:User)
  {
    //console.log(this.userWhoWaitMatch.length);
    //console.log("lol");
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
      const match : Match = await this.create(this.userWhoWaitMatch[0].user, this.userWhoWaitMatch[1].user);
      const clients = {
        clientOne: this.userWhoWaitMatch[0].socket,
        clientTwo: this.userWhoWaitMatch[1].socket,
      }
      this.userWhoWaitMatch.splice(1);
      this.userWhoWaitMatch.splice(0);
      return { match, clients };
    }
    return { match: null, clients: null };
  }

  async findOne(id: string) {
    const arr = await myDataSource.getRepository(Player).find({relations: ['userRef']});
      arr.forEach(element  => {
        if (element.userRef.id == id)
          return element.matchRef;
      })
  }

  gameExist(gameId: string) : boolean
  {
    return this.games.has(gameId);
  }

  getGame(gameId: string) : Game
  {
    return this.games[gameId];
  }

  createMMGame
  (
    gameId: string,
    playerOneId: string,
    playerTwoId: string,
  )
  {
    let game : Game = new Game(
      gameId,
      playerOneId,
      playerTwoId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
    this.games[gameId] = game;
  }
}
