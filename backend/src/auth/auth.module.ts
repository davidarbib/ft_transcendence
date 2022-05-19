import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { Api42Strategy } from './strategies/api42.strategy';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, Api42Strategy]
})
export class AuthModule {}
