import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer} from '@nestjs/websockets';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import {UseGuards,Request} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { Messages } from './entities/message.entity';
import { CreateChannelDto } from 'src/channels/dto/create-channel.dto';
import { ChanParticipant } from 'src/chan-participants/entities/chan-participant.entity';
import { ChanPartStatus } from 'src/chan-participants/entities/chan-participant.entity';
import { myDataSource } from 'src/app-data-source';
import { Channel, ChanType } from 'src/channels/entities/channel.entity';

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

  @SubscribeMessage('findMessageFromChan')
  async findMsg(@MessageBody('name') name:string, @MessageBody('login') login:string)
  {
    const msg = await this.messageService.findMsg(name, login);
    return  msg;
  }

  @SubscribeMessage('createChannel')
  async createChan(@MessageBody('login') login: string, @MessageBody('name')name : string, @MessageBody('type')type : ChanType, @MessageBody('password')password : string,  @ConnectedSocket() client:Socket) 
  {
    console.log(name);
    const usr = await myDataSource.getRepository(User).findOne({where : { login:login}});
      const chanPart : ChanParticipant = new ChanParticipant;
      const chan : Channel = new Channel;
      chan.name = name;
      chan.type = type;
      chan.password = password;
      const tmp_chan = await myDataSource.getRepository(Channel).save(chan);
      chanPart.participant = usr;
      chanPart.chan = tmp_chan;
      chanPart.privilege = ChanPartStatus.OWNER;
      await myDataSource.getRepository(ChanParticipant).save(chanPart);
      client.on("connection", (socket) => {
        socket.join(name);
      });
  }


  @SubscribeMessage('joinchan')
  async joinRoom( @MessageBody('login') login:string,@ConnectedSocket() client:Socket, @MessageBody('name') name:string) {
    const userToJoin =  await this.messageService.identify(login, name, client);
    if (userToJoin == 0)
  {
    client.on("connection", (socket) => {
      socket.join(name);
    });

  }
  }}
