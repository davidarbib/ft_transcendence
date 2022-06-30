import { Module, forwardRef } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';
import { MatchesService } from 'src/matches/matches.service';
import { PlayersService } from 'src/players/players.service';
import { Repository } from 'typeorm';

@Module({
  providers: [GamesGateway, GamesService, MatchesService,PlayersService, Repository],
})
export class GamesModule {}
