import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports:
    [
      UsersModule,
      TypeOrmModule.forRoot(),
    ], 
})
export class AppModule {
  constructor(private datasource: DataSource) {
    this.datasource.initialize()
      .then(() => {
        console.log('data source initialized')
      })
      .catch((err) => {
        console.error('error during data source initialization')
      });
  }
}
