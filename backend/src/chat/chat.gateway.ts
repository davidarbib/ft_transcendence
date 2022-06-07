import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer} from '@nestjs/websockets';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {UseGuards,Request} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/messages/entities/message.entity';

@WebSocketGateway({
  cors:{
    origin: '*',
  },
})
@UseGuards(JwtGuard) 
export class ChatGateway
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createChat')
  async create(@Request() req, @MessageBody() createChatDto: CreateChatDto) {
    const usr:User = req.user;
    const chat = await  this.chatService.create(usr, createChatDto);
    this.server.emit('message', chat);
    return chat;
  }
  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('joinchat')
  joinRoom( @Request() req , @MessageBody('name') name:string) {
    const usr: User = req.user;
    return this.chatService.identify(name, usr);
  }
}
