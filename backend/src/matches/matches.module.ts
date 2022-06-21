import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Repository } from 'typeorm';

@Module({
  controllers: [MatchesController],
  providers: [
    MatchesService,
    Repository
  ]
})
export class MatchesModule {}
