import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Api42Strategy } from './strategies/api42.strategy';
import { Repository } from 'typeorm';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [
    Api42Strategy,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    Repository,
  ]
})
export class AuthModule {}
