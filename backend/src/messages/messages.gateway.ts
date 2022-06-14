import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer} from '@nestjs/websockets';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import {UseGuards,Request} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { Messages } from './entities/message.entity';

@WebSocketGateway({
  cors:{
    origin: '*',
  },
})
export class MessagesGateway
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly messageService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody('name') name:string,@MessageBody('login') login :string, @MessageBody() createMessageDto: CreateMessageDto) {
    const message = await  this.messageService.create(login, name, createMessageDto);
   this.server.emit('message', message);
    return message;
  }
  @SubscribeMessage('findAllMessage')
  async findAll() {
    const msg = await this.messageService.findAll();
    return msg;
  }

  @SubscribeMessage('joinchan')
  joinRoom( @MessageBody('login') login:string, @MessageBody('name') name:string) {
    console.log("hihi");
    return this.messageService.identify(name, login);
  }
}
