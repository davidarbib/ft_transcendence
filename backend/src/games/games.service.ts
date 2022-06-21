import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { User } from 'src/users/entities/user.entity';
import { MatchesService } from 'src/matches/matches.service';
import { Match } from 'src/matches/entities/match.entity';
import { PlayersService } from 'src/players/players.service';
import { myDataSource } from 'src/app-data-source';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class GamesService {
  constructor(private readonly matchesService : MatchesService, private readonly playersService : PlayersService ) {}
  userWhoWaitMatch : User[] = [];

 async create(user: User, user1 :User) {
    
  const match =await  this.matchesService.create();
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
    const index =this.userWhoWaitMatch.findIndex(this.userWhoWaitMatch[user.id]);
    this.userWhoWaitMatch.splice(index);
  }
  async matchmaking()
  {
    //setInterval 
      while (1)
      {
        if (this.userWhoWaitMatch.length >= 2)
        {
          this.create(this.userWhoWaitMatch[0], this.userWhoWaitMatch[1]);
          this.userWhoWaitMatch.splice(1);
          this.userWhoWaitMatch.splice(0);
          return true; 
        }
      }
  }

  findAll() {
    return `This action returns all games`;
  }

  async findOne(id: string) {
    const arr = await myDataSource.getRepository(Player).find({relations: ['userRef']});
      arr.forEach(element  => {
        if (element.userRef.id == id)
          return element.matchRef;
      })
    return `This action returns all games`;
  }
  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
