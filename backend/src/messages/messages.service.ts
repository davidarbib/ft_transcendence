import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { Messages } from 'src/messages/entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { ChanParticipant } from 'src/chan-participants/entities/chan-participant.entity';
import { channel } from 'diagnostics_channel';
import { Console } from 'console';
import { ContactsService } from 'src/contacts/contacts.service';
import { Server, Socket } from 'socket.io';
import { UpdateChanParticipantDto } from 'src/chan-participants/dto/update-chan-participant.dto';
import { ChanPartStatus } from 'src/chan-participants/entities/chan-participant.entity';



@Injectable()
export class MessagesService {
 
  constructor (
    private msgRepo : Repository<Messages>,
    private contactsService: ContactsService
  )
  {
    this.msgRepo = myDataSource.getRepository(Messages);
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
    return msg;
  }

  async findChan( usr:User){

    const test = await myDataSource.getRepository(ChanParticipant).find({ relations: ['participant', 'chan'] });
    let arr: any = [];
    test.forEach(element => {
      if (element.participant.login == usr.login)
        arr.push(element.chan)
    });
  }
 async muteBanUser( name: string,updateChanParticipantDto:UpdateChanParticipantDto, target :string)
  {
    let chanPart :ChanParticipant;
    const arr = await myDataSource.getRepository(ChanParticipant).find({relations:['participant', 'chan']});
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
                const {mute, ban} = updateChanParticipantDto;
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

  }

  async findAll() {
    const msg = await myDataSource.getRepository(Messages).find();
    return msg
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

  async identify(login: string, name:string)
  {
    let isonChan:boolean = false;
    const chan = await myDataSource.getRepository(Channel).findOne({where : {name:name}})
    const usr = await myDataSource.getRepository(User).findOne({where : {login:login}})
    const arr = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
    arr.forEach(element => {
  if (element.participant.login == login && element.chan.name == name)
      {
        console.log("YAHHHH");
        isonChan = true;
      }
  })
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
  async list_contact(login : string)
  {

  }
}
