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
import { ContactsModule } from './contacts/contacts.module';
import { createDataModule } from './Create_data/createData.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GamesModule } from './games/games.module';


let envPath = 'src/.env';

@Module({
  imports:
    [
      ConfigModule.forRoot({
        envFilePath: envPath,
        isGlobal: true,
      }),
      EventEmitterModule.forRoot(),
      UsersModule,
      ChannelsModule,
      MatchesModule,
      MessagesModule,
      ChanParticipantsModule,
      PlayersModule,
      ContactsModule,
      createDataModule,
      AuthModule,
    ],
})
export class AppModule {
  constructor()
  {
    myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
  }
}