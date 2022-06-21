import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Match } from 'src/matches/entities/match.entity';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class MatchesService {
  constructor (private matchRepo : Repository<Match>)
  {}

  create() : Promise<Match>
  {
    let match : Match = new Match();
    return this.matchRepo.save(match);
  }

  init(match: Match, player1 : Player, player2: Player)
  {
    match.players.push(player1);
    match.players.push(player2);
    match.active = true;
    return this.matchRepo.save(match);
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



  finish(match: Match) : string
  {
    match.active = false;
    this.matchRepo.save(match);
    return 'this action set the match as finished';
  }
}
