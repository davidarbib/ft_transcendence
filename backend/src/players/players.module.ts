import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { Repository } from 'typeorm';

@Module({
  controllers: [PlayersController],
  providers: [
    PlayersService,
    Repository,
  ]
})
export class PlayersModule {}