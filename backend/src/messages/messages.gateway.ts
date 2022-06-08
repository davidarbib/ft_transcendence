import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer} from '@nestjs/websockets';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import {UseGuards,Request} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors:{
    origin: '*',
  },
})
@UseGuards(JwtGuard) 
export class MessagesGateway
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly messageService: MessagesService) {}

  @SubscribeMessage('createChat')
  async create(@Request() req,@MessageBody('name') name:string, @MessageBody() createMessageDto: CreateMessageDto) {
    const usr:User = req.user;
    const chat = await  this.messageService.create(usr, name, createMessageDto);
    this.server.emit('message', chat);
    return chat;
  }
  @SubscribeMessage('findAllChat')
  findAll() {
    return this.messageService.findAll();
  }

  @SubscribeMessage('joinchat')
  joinRoom( @Request() req , @MessageBody('name') name:string) {
    const usr: User = req.user;
    return this.messageService.identify(name, usr);
  }
}
