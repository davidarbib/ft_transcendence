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

@Injectable()
export class GamesService {

  constructor
  (
    private readonly matchesService : MatchesService,
    private readonly playersService : PlayersService,
    public games: {},
  )
  { }

  userWhoWaitMatch : User[] = [];

  async create(user: User, user1 :User) {
    const match = await this.matchesService.create();
    const player = await this.playersService.create(user, match);
    const player1 = await this.playersService.create(user1, match);
    return await this.matchesService.init(match, player, player1);
  }

  userWaiting(user:User)
  {
    this.userWhoWaitMatch.push(user);
  }

  userStopWaiting(user:User)
  {
    console.log(this.userWhoWaitMatch.length);
    console.log("lol");
    let index:number = 0;
    this.userWhoWaitMatch.forEach(element => {
      if (element.id == user.id) {
        this.userWhoWaitMatch.splice(index);
        return;
      }
      index++;   
    });
  }

  async matchmaking()
  {
    if (this.userWhoWaitMatch.length >= 2) {
      this.create(this.userWhoWaitMatch[0], this.userWhoWaitMatch[1]);
      this.userWhoWaitMatch.splice(1);
      this.userWhoWaitMatch.splice(0);
      return true;
    }
  }

  async findOne(id: string) {
    const arr = await myDataSource.getRepository(Player).find({relations: ['userRef']});
      arr.forEach(element  => {
        if (element.userRef.id == id)
          return element.matchRef;
      })
  }

}
