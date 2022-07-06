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

  @SubscribeMessage('ourchan')
  async findChan( @MessageBody('user') user:User)
  {
    const chan = await this.messageService.findChan(user);
    console.log(chan);
    this.server.emit('chan', chan);
    return  chan ;
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
    console.log("ddd");
    const userToJoin =  await this.messageService.identify(login, name, client);
    if (userToJoin == 0)
    {
    client.on("connection", (socket) => {
      socket.join(name);
    });

  }
}
  @SubscribeMessage('leavechan')
  async LeaveRoom( @MessageBody('user') user:User, @MessageBody('name') name:string)
  {
    console.log("oui ca passe ici");
    const chanPart = await myDataSource.getRepository(ChanParticipant).find({relations:['participant', 'chan']})
   chanPart.forEach( async element => {
    if (element.participant && element.chan)
    {
      if (element.participant.login == user.login && element.chan.name == name)
      {
        const chanPartDelete = await myDataSource.getRepository(ChanParticipant).findOneBy({id : element.id});
         chanPartDelete.remove();
        return ;
      }

    }
  })
  }
  @SubscribeMessage('userAdmin')
  async ListOfAdmin( @MessageBody('name') name:string)
  {
    let  listAdmin;
      const list = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
      list.forEach( element => {
        if (element.chan && element.participant)
        {
          if (element.chan.name == name && element.privilege == ChanPartStatus.ADMIN)
            listAdmin.push(element.participant);
        }
      })
      return listAdmin;
    }

  @SubscribeMessage('Owner')
  async TheOwner( @MessageBody('name') name:string)
  {
    const list = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
    list.forEach( element => {
      if (element.chan && element.participant)
      {
        if (element.chan.name == name && element.privilege == ChanPartStatus.OWNER)
          return element.participant;
      }
    })
  }

  @SubscribeMessage('addAdmin')
  async addAdmin( @MessageBody('name') name:string, @MessageBody('user') user:User, @MessageBody('login') login:string )
  {
    const list = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
    list.forEach( element => {

      if (element.chan && element.participant)
      {
        if (element.chan.name == name &&  element.participant.login== user.login  && (element.privilege == ChanPartStatus.OWNER  || element.privilege == ChanPartStatus.ADMIN))
        {
          list.forEach(async element1 => {
            if (element1.chan.name == name &&  element1.participant.login== login)
            {
              const chanPart = element1;
              chanPart.privilege = ChanPartStatus.ADMIN;
              await myDataSource.getRepository(ChanParticipant).save(chanPart);
              return;

            }

          })
        }
      }
    })
  }
  
  // @SubscribeMessage('addfriend')
  // async TheOwner( @MessageBody('name') name:string)
  // {
  //   const list = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
  //   list.forEach( element => {
  //     if (element.chan && element.participant)
  //     {
  //       if (element.chan.name == name && element.privilege == ChanPartStatus.OWNER)
  //         return element.participant;
  //     }
  //   })
  // }
  /*
  @SubscribeMessage('listOfContacts')
  async list_contact( @MessageBody('login') login :string)
  {

    return this.messageService.list_contact(login);
  }*/
}
  
