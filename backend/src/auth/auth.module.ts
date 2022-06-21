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
import { JwtTwoFaStrategy } from './strategies/jwtTwoFa.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from './guards/jwt.guard';
import { TwoFactorAuthController } from './twoFactorAuth.controller';
import { TwoFactorAuthService } from './services/twoFactorAuth.service';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRATION_STR'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    TwoFactorAuthController
  ],
  providers: [
    Api42Strategy,
    DiscordStrategy,
    LocalStrategy,
    JwtStrategy,
    JwtTwoFaStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    Repository,
    AuthService,
    TwoFactorAuthService,
  ],
  //exports: []
})

export class AuthModule {}
