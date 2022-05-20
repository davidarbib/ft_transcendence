import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Repository } from 'typeorm';

@Module({
  controllers: [UsersController],
  providers: [UsersService, Repository],
  exports: [UsersService]
})
export class UsersModule {}
