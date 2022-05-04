import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { myDataSource } from './app-data-source';
import { ChannelsModule } from './channels/channels.module';
import { MatchesModule } from './matches/matches.module';
import { MessagesModule } from './messages/messages.module';
import { ChanParticipantsModule } from './chan-participants/chan-participants.module';
import { PlayersModule } from './players/players.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports:
    [
      UsersModule,
      ChannelsModule,
      MatchesModule,
      MessagesModule,
      ChanParticipantsModule,
      PlayersModule,
      DatabaseModule,
    ], 
})
export class AppModule {
  constructor()
  {
    myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
  }
}