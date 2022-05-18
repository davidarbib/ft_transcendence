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

let envFilePath = 'src/.env';

@Module({
  imports:
    [
      UsersModule,
      ChannelsModule,
      MatchesModule,
      MessagesModule,
      ChanParticipantsModule,
      PlayersModule,
      ContactsModule,
      createDataModule,
      AuthModule,
      ConfigModule.forRoot({ envFilePath }),
    ], 
})
export class AppModule {
  constructor()
  {
    myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        console.log(process.env.API42_CALLBACK_URL);
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
  }
}