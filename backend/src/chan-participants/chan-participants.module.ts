import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'
import { ChanParticipantsService } from './chan-participants.service';
import { ChanParticipantsController } from './chan-participants.controller';

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
  controllers: [ChanParticipantsController],
  providers: [ChanParticipantsService]
})
export class ChanParticipantsModule {}
