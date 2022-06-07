import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Repository } from 'typeorm';

@Module({
    providers: [ChatGateway, ChatService,Repository ]
})
export class ChatModule {}
