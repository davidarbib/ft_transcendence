import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { Repository } from 'typeorm';
import { Match } from 'src/matches/entities/match.entity';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class MatchesService {
  constructor (private matchRepo : Repository<Match>)
  {
    this.matchRepo = myDataSource.getRepository(Match);
  }

  async create()
  {
    let match : Match = new Match();
    return await myDataSource.getRepository(Match).save(match);
  }

  async init(match: Match, player1 : Player, player2: Player) : Promise <Match>
  {
    //match.players.push(player1);
    //match.players.push(player2);
    match.active = true;
    return await myDataSource.getRepository(Match).save(match);
  }

  findAllFinished() : Promise<Match[]>
  {
    return this.matchRepo.find({
      where: { active: true }
    });
  }

  findOne(id: string) : Promise<Match> 
  {
    return this.matchRepo.findOne({
      where: { id: id }
    });
  }

  async finish(match: Match) 
  {
    match.active = false;
    return await myDataSource.getRepository(Match).save(match);
  }
}
