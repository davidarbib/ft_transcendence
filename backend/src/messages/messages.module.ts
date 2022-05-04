import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Put_Data } from 'src/put-data-db/data';
import { Message } from './entities/message.entity';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {
  constructor()
  {
    Put_Data();
  }
}
