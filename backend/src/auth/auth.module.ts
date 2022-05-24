import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Api42Strategy } from './strategies/api42.strategy';
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
      secret: 'SECRET', //TODO env
      signOptions: { expiresIn: '60s'} //TODO env
    })
  ],
  controllers: [AuthController],
  providers: [
    Api42Strategy,
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
