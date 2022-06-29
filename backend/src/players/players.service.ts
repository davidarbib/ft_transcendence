import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import { Match } from 'src/matches/entities/match.entity';
import { myDataSource } from 'src/app-data-source';

@Injectable()
export class PlayersService
{
  constructor (private playerRepo: Repository<Player>)
  { }

  async create(user: User, match: Match)
  {
    let player: Player = new Player();
    
    player.userRef = user;
    player.matchRef = match;
    return await myDataSource.getRepository(Player).save(player);
  }

  findAll() : Promise<Player[]>
  {
    return this.playerRepo.find();
  }

  findOne(id: string) : Promise<Player>
  {
    return this.playerRepo.findOne({
      where: {id : id},
    })
  }

  async incrementScore(player: Player) 
  {
    player.score++;
    await myDataSource.getRepository(Player).save(player);
    return  player.score;
  }

  async setWinner(player: Player) 
  {
    player.winner = true;
    await myDataSource.getRepository(Player).save(player);
    return player;
  }
}