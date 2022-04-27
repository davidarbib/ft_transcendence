import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { myDataSource } from './app-data-source';

@Module({
  imports:
    [
      UsersModule,
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