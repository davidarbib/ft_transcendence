import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { Repository } from 'typeorm';
import { UsersModule } from 'src/users/users.module';
import { MatchesModule } from 'src/matches/matches.module';

@Module({
  imports: [
    UsersModule,
  ],
  controllers: [PlayersController],
  providers: [
    PlayersService,
    Repository,
  ],
  exports: [
    PlayersService
  ]
})
export class PlayersModule {}