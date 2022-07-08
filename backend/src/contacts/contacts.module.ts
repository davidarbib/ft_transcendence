import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'
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
  controllers: [ContactsController],
  providers: [ContactsService]
})
export class ContactsModule {}
