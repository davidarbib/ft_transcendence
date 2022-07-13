import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer} from '@nestjs/websockets';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import {UseGuards,Request} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import {HttpException, HttpStatus} from '@nestjs/common'
import { Messages } from './entities/message.entity';
import { Contact} from 'src/contacts/entities/contact.entity' ;
import { CreateChannelDto } from 'src/channels/dto/create-channel.dto';
import { ChanParticipant } from 'src/chan-participants/entities/chan-participant.entity';
import { ChanPartStatus } from 'src/chan-participants/entities/chan-participant.entity';
import { myDataSource } from 'src/app-data-source';
import { Channel, ChanType } from 'src/channels/entities/channel.entity';
import { UpdateChanParticipantDto } from 'src/chan-participants/dto/update-chan-participant.dto';
import {bcrypt} from 'bcryptjs'
import { IsLoginlNotExisting } from 'src/users/validator/is-login-already-exist.validator';
//var bcrypt = require('bcryptjs');

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

  @SubscribeMessage('setConnexion')
  async setCo(@MessageBody('user') user:User, @ConnectedSocket() client:Socket)
  {  
    this.messageService.setCo(user, client);
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody('name') name:string,@MessageBody('login') login :string, @MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client:Socket) {
    const {msg, chan} = await  this.messageService.create(login, name, createMessageDto);
   this.server.emit('message', msg, chan);
    return {msg};
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
  @SubscribeMessage('isBlock')
  async block_bool(@MessageBody('user') user:string, @MessageBody('target') target:string)
  {
      const block = this.messageService.is_block(user, target);
    return  block;
  }
  @SubscribeMessage('ourchan')
  async findChan( @MessageBody('user') user:User )
  {
    const chan = await this.messageService.findChan(user);
    this.server.emit('chan', chan);
    return  chan;
  }
  @SubscribeMessage('blockUser')
  async BlockUser( @MessageBody('user') user:User, @MessageBody('target') target:User )
  {
    const contact = await myDataSource.getRepository(Contact).find();
    let friendship;
    contact.forEach(element => {
      if ( element.userLogin == user.login && element.followedLogin == target.login)
        friendship = element;
    })
    if (friendship)
    {
        friendship.block = true;
        await myDataSource.getRepository(Contact).save(friendship);
        return ;
    }
    else 
    {
      friendship = new Contact();
      friendship.userLogin = user.login;
      friendship.followedLogin = target.login;
      friendship.block = true;
      await myDataSource.getRepository(Contact).save(friendship);
    }
  }
  @SubscribeMessage('isTimeToDemut')
  async isTimeTo(@MessageBody('user') usr:User, @MessageBody('name') name:string) 
  {
    let date = new Date();
    let chanPart;
      const listchanPart = await myDataSource.getRepository(ChanParticipant).find({relations:['chan', 'participant']});
        listchanPart.forEach(element => {
            if (element.chan.name == name && element.participant.login == usr.login)
              {
                if (element.end_timestamp < date && element.ban != true)
                {
                  element.end_timestamp = null;
                  element.mute = false;
                  chanPart = element;
                }
              }
            });
           if ( chanPart.ban == false && chanPart.mute == false)
           {

            await myDataSource.getRepository(ChanParticipant).save(chanPart);
            return true;
           }
        
  } 
  @SubscribeMessage('isTimeToDeBan')
  async isTimeTodeban(@MessageBody('user') usr:User, @MessageBody('name') name:string) 
  {
    let date = new Date();
    let chanPart;
      const listchanPart = await myDataSource.getRepository(ChanParticipant).find({relations:['chan', 'participant']});
        listchanPart.forEach(element => {
            if (element.chan.name == name && element.participant.login == usr.login)
              {
                if (element.end_timestamp < date && element.mute == false)
                {
                  element.end_timestamp = null;
                  element.ban = false;
                  chanPart = element;
                }
              }
            });
            if (chanPart){
             if (chanPart.ban == false && chanPart.mute == false)
                await myDataSource.getRepository(ChanParticipant).save(chanPart);
            }
  }

  @SubscribeMessage('createChannel')
  async createChan(@MessageBody('user') usr:User , @MessageBody('name')name : string, @MessageBody('type')type : ChanType, @MessageBody('password')password : string,  @ConnectedSocket() client:Socket) 
  {
      const chan = await this.messageService.CreateChan(usr, name, type, password,client)
      client.join(chan.id);
      this.server.in(client.id).emit('join', chan);
      this.server.emit('creation', chan);
  }


  @SubscribeMessage('joinchan')
  async joinRoom( @MessageBody('user') usr:User,@ConnectedSocket() client:Socket, @MessageBody('name') name:string) {
    const chan = await myDataSource.getRepository(Channel).findOne({where : { name:name}});
    const userToJoin =  await this.messageService.identify(usr, name, client);
    if (userToJoin == false)
    {
      this.server.to(chan.id).emit('newUser', usr, chan);
      client.join(chan.id);
      this.server.in(client.id).emit('join', chan);
  }
}
  @SubscribeMessage('leavechan')
  async LeaveRoom( @MessageBody('user') user:User, @MessageBody('name') name:string)
  {
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
  
  @SubscribeMessage('userChanStatus')
  async userchanStatus( @MessageBody('name') name:string, @MessageBody('login') login:string )
  {
    const list = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
    list.forEach( element => {
      if (element.chan && element.participant)
      {
        if (element.chan.name == name && element.participant.login == login)
          if(element.ban == true)
            return "BAN";
          if (element.mute == true)
            return "MUTE";
          if (element.privilege == ChanPartStatus.OWNER)
              return "OWNER";
          if (element.privilege == ChanPartStatus.ADMIN)
            return "ADMIN";
      }
    })
  }
  @SubscribeMessage('MuteBanUser')
  async MuteBanUser( @MessageBody('name') name:string, @MessageBody('user') usr:User, @MessageBody('target') target:string , @MessageBody() updateChanParticipantDto: UpdateChanParticipantDto, @ConnectedSocket() client:Socket) {

    const {arg, bool, chan} = await this.messageService.muteBanUser(name, updateChanParticipantDto, target);
    this.server.emit("UsernewStatus", {status:arg, bool:bool, chan :chan, user:usr});
  }

  @SubscribeMessage('needPassword')
  async needPassword(@MessageBody('name') name:string)
  {
    const chan = await myDataSource.getRepository(Channel).findOne({where:{name:name}});
    if ( chan.password)
      return true;
    return false;
  }
  @SubscribeMessage('isPassword')
  async isPassword(@MessageBody('name') name:string, @MessageBody('password') password:string)
  {
    const chan = await myDataSource.getRepository(Channel).findOne({where:{name:name}});
    if (bcrypt.compareSync(password, chan.password) == true)
      return true;
    return false;
  }
  
  @SubscribeMessage('changePassword')
  async changePassword(@MessageBody('name') name:string, @MessageBody('password') password:string)
  {
    const chan = await myDataSource.getRepository(Channel).findOne({where:{name:name}});
    var hash = bcrypt.hashSync(password, 8);
    chan.password = hash;
    await myDataSource.getRepository(Channel).save(chan);
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
             listAdmin.push(element);
        }
      })
      return listAdmin;
    }
  @SubscribeMessage('getUserInChan')
  async getUserChan( @MessageBody('name') name:string)
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
  @SubscribeMessage('getMuteInChan')
  async getMuteChan( @MessageBody('name') name:string)
  {
    const arr:User[] = [];
    const list = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
    list.forEach( element => {
      if (element.chan && element.participant)
      {
        if (element.chan.name == name && element.mute == true)
          arr.push( element.participant);
      }
    })
    return arr;
  }
  @SubscribeMessage('getBanInChan')
  async getBanChan( @MessageBody('name') name:string)
  {
    const arr:User[] = [];
    const list = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
    list.forEach( element => {
      if (element.chan && element.participant)
      {
        if (element.chan.name == name && element.ban == true)
          arr.push( element.participant);
      }
    })
    return arr;
  }

  @SubscribeMessage('createDM')
  async createDM( @MessageBody('user') user:User, @MessageBody('target') target:User, @ConnectedSocket() client:Socket)
  {
    if (user.login == target.login)
      return ;
    // tcheker si il est blocker  dans les deux sens 
    const { chan, targetsocket} = await this.messageService.createDM(user, target)
    if (chan && targetsocket)
    {
      client.join(chan.id);
      targetsocket.join(chan.id);
      this.server.in(client.id).emit('join', chan);
      this.server.in(targetsocket.id).emit('join', chan);

    }
  }
  @SubscribeMessage('addAdmin')
  async addAdmin( @MessageBody('name') name:string, @MessageBody('user') user:User, @MessageBody('login') login:string, @ConnectedSocket() client:Socket)
  {
    const list = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
    const chan = await myDataSource.getRepository(Channel).findOne({where : {name:name}})
    let chanPart;
    list.forEach( element => {

      if (element.chan && element.participant)
      {
        if (element.chan.name == name &&  element.participant.login== user.login  && (element.privilege == ChanPartStatus.OWNER  || element.privilege == ChanPartStatus.ADMIN))
        {
          list.forEach(async element1 => {
            if (element1.chan.name == name &&  element1.participant.login== login)
            {
              chanPart = element1;
              chanPart.privilege = ChanPartStatus.ADMIN;
              await myDataSource.getRepository(ChanParticipant).save(chanPart);
              return;

            }

          })
        }
      }
    })
    this.server.in(client.id).emit('newadmin', chan, chanPart.participant);
  }
  
  @SubscribeMessage('addfriend')
  async addFriend( @MessageBody('user') user:string, @MessageBody('target') target:string )
  {
     const contact = await myDataSource.getRepository(Contact).findOne({where :{userLogin:user, followedLogin: target}})
    if (contact)
      return ;
    return this.messageService.friendship(user, target);
  }
  /*
  @SubscribeMessage('listOfContacts')
  async list_contact( @MessageBody('login') login :string)
  {

    return this.messageService.list_contact(login);
  }*/
}
  
