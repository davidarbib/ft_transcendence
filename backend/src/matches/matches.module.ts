import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Repository } from 'typeorm';
import { PlayersModule } from 'src/players/players.module';


@Module({
  imports: [ PlayersModule, ],
  controllers: [MatchesController],
  providers: [
    MatchesService,
    Repository
  ]
})
export class MatchesModule {}
