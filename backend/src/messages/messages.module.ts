import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { Repository } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/users.module';
import { ContactsService } from 'src/contacts/contacts.service';

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
    providers: [MessagesGateway, MessagesService,Repository, ContactsService]
})
export class MessagesModule {}
