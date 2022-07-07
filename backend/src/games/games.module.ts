import { Module } from '@nestjs/common';
import { MatchesModule } from 'src/matches/matches.module';
import { PlayersModule } from 'src/players/players.module';
import { UsersModule } from 'src/users/users.module';
import { Repository } from 'typeorm';
import { GamesGateway } from './games.gateway';
import { GamesService } from './games.service';

@Module({
  imports: [
    MatchesModule,
    PlayersModule,
    UsersModule,
  ],
  providers: [
    Repository,
    GamesGateway,
    GamesService],
  exports: [
    GamesGateway,
    GamesService,
  ]
})
export class GamesModule {}
