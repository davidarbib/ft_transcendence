import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Api42Strategy } from './strategies/api42.strategy';
import { DiscordStrategy } from './strategies/discord.strategy';
import { Repository } from 'typeorm';
import { SessionSerializer } from './utils/Serializer';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      //secret: process.env.JWT_SECRET,
      secret: 'SECRET', //TODO
      signOptions: { expiresIn: '60s'}
    })
  ],
  controllers: [AuthController],
  providers: [
    Api42Strategy,
    DiscordStrategy,
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    Repository,
    AuthService
  ],
  //exports: [AuthService]
})
export class AuthModule {}
