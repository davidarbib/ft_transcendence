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
  {
    this.playerRepo = myDataSource.getRepository(Player);
  }

  create(user: User, match: Match) : Promise<Player>
  {
    let player: Player = new Player();
    
    player.userRef = user;
    player.matchRef = match;
    return this.playerRepo.save(player);
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

  incrementScore(player: Player) : string
  {
    player.score++;
    this.playerRepo.save(player);
    return 'this action increment score';
  }

  setWinner(player: Player) : string
  {
    player.winner = true;
    this.playerRepo.save(player);
    return 'this action set the player as winner';
  }
}