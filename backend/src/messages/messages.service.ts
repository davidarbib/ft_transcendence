import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { Messages } from 'src/messages/entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Channel, ChanType } from 'src/channels/entities/channel.entity';
import { ChanParticipant } from 'src/chan-participants/entities/chan-participant.entity';
import { channel } from 'diagnostics_channel';
import { Console } from 'console';
import { ContactsService } from 'src/contacts/contacts.service';
import { Server, Socket } from 'socket.io';
import { UpdateChanParticipantDto } from 'src/chan-participants/dto/update-chan-participant.dto';
import { ChanPartStatus } from 'src/chan-participants/entities/chan-participant.entity';
import { Contact } from 'src/contacts/entities/contact.entity';


@Injectable()
export class MessagesService {
 
  constructor (
    private msgRepo : Repository<Messages>,
    private contactsService: ContactsService
  )
  {
    this.msgRepo = myDataSource.getRepository(Messages);
  }
  userSocket : Map<string, Socket> = new Map();

  async setCo(user:User, client :Socket)
  {
      this.userSocket[user.id] = client;
  }
  async create(login:string ,name: string, createMessageDto: CreateMessageDto) {

    const chan  = await myDataSource.getRepository(Channel).findOne({where : {name : name}})
    const usr  = await myDataSource.getRepository(User).findOne({where : {login : login}})
    //  if (!usr)
    //return ; // need to implement HTTPrequest
    createMessageDto.author = usr;
    createMessageDto.time = new Date();
    createMessageDto.chan = chan; 
    createMessageDto.login = login; 
    const msg = await this.msgRepo.save(createMessageDto)
    console.log(this.userSocket);
    return {msg : msg, chan:chan};
  }
  async CreateChan(usr:User, name :string, type :ChanType, password: string, socket:Socket)
  {
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
   
    return chan;
  }
  async findChan( usr:User){

    const test = await myDataSource.getRepository(ChanParticipant).find({ relations: ['participant', 'chan'] });
    let arr: any = [];
    test.forEach(element => {
      if (element.participant && element.chan){
      if (element.participant.login == usr.login)
      {
        arr.push(element.chan)
      }
      }
    });
  }
 async muteBanUser( name: string,updateChanParticipantDto:UpdateChanParticipantDto, target :string)
  {
    let chanPart :ChanParticipant;
    const chan = await myDataSource.getRepository(Channel).findOne({where: {name:name}})
    const arr = await myDataSource.getRepository(ChanParticipant).find({relations:['participant', 'chan']});
    const {mute, ban} = updateChanParticipantDto;
    arr.forEach( async element => {
        if (element.chan && element.participant)
        {
          if ( element.chan.name == name)
          { 
            if (element.participant.login == target && element.chan.name == name)
            {    
            chanPart = element;
                let date =   new Date(Date.now());
                date.setHours(date.getHours() +2);
                 chanPart.mute = mute;
                 chanPart.ban = ban;
                 if ( mute == true  || ban == true)
                 chanPart.end_timestamp = date;
                 if (mute == false && ban ==false)
                   chanPart.end_timestamp = new Date(null);
                   return await myDataSource.getRepository(ChanParticipant).save(chanPart);
          }
        }
        }
      })
        if (ban)
          return ({arg:"ban", bool: ban, chan :chan});
          if (mute)
          return ({arg:"mute", bool:mute, chan:chan });
  }

  async findAll() {
    const msg = await myDataSource.getRepository(Messages).find();
    return msg
  }

  async is_block(login:string, target :string)
  {
    let userblock = false;
    let targetblock = false;
    const list_contact = await myDataSource.getRepository(Contact).find();
    list_contact.forEach(element => {
      if (element.userLogin == login && element.followedLogin == target)
        {
          if (element.block == true)
          {
              userblock = true;
          }
        }
        if (element.userLogin == target && element.followedLogin == login)
       {
          targetblock = true;
       }
      });
      return {userblock:userblock, targetblock:targetblock}
  }

  async is_chan_exist(name:string) : Promise<Boolean>
  {
    let chan_exist = false;
    const lsit_chan = await myDataSource.getRepository(Channel).find();
      lsit_chan.forEach(element => {
        if (element.name == name)
          chan_exist = true;
      })
      return chan_exist;
  }
  async createChanDm(user:User, target:User)
  {
    const chan: Channel =  new Channel();
    chan.name = user.login+"_"+ target.login;
    chan.type = ChanType.DM;
    await myDataSource.getRepository(Channel).save(chan);
    const chanPart: ChanParticipant =  new ChanParticipant();
    const chanPart1: ChanParticipant =  new ChanParticipant();
    chanPart1.privilege = ChanPartStatus.NORMAL;
    chanPart.privilege = ChanPartStatus.NORMAL;
    chanPart.participant = user;
    chanPart1.participant = target;
    chanPart.chan = chan;
    chanPart1.chan = chan;
    await myDataSource.getRepository(ChanParticipant).save(chanPart);
    await myDataSource.getRepository(ChanParticipant).save(chanPart1);
    return chan;
  }
  async createDM(user:User, target:User)
  { 
    const is_chan_exist = await this.is_chan_exist(user.login+'_'+target.login); 
    if (is_chan_exist == true)
      return { };
    const { userblock, targetblock} = await  this.is_block(user.login, target.login);
      if (userblock || targetblock)
        return {};
      let socketTarget:Socket = this.userSocket[target.id];
   /* this.userSocket.forEach(element => {
      if (element.== target.login )
      {
          socketTarget = element.socket;
          return ;
      }*/
    const chan = await this.createChanDm(user, target);
    return {chan: chan, targetsocket: socketTarget};

  }
  async findMsg(name: string, login: string )
  {
    const msg = await this.msgRepo.find({ relations: [ 'chan', 'author'] })
    let arr : any = [];
    msg.forEach(element => {
      if (element.chan)
      {
     if (element.chan.name == name)
      {
        //if (!this.contactsService.block_bool(login, element.author.login))
             arr.push(element);
      }
    }
    });
    return arr;
  }

  async identify(usr:User , name:string, socket:Socket)
  {
    let isonChan:boolean = false;
    const chan = await myDataSource.getRepository(Channel).findOne({where : {name:name}})
    const arr = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
    arr.forEach(element => {
      if (element.participant && element.chan){
  if (element.participant.login == usr.login && element.chan.name == name)
      {
        isonChan = true;
      }
  }})
    if (isonChan == false)
    {
      const chanPart : ChanParticipant = new ChanParticipant;
      chanPart.participant = usr;
      chanPart.chan = chan;
      await myDataSource.getRepository(ChanParticipant).save(chanPart);
    }
  //  chan.participants.push(chanPart);
    return  isonChan;
  }
}
