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
import {elementAt} from "rxjs";


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
    console.log(name);
   await myDataSource.getRepository(Channel).save(chan);
    const msg = await this.msgRepo.save(createMessageDto)
    //  chan.messages.push(msg);
      await myDataSource.getRepository(Channel).save(chan);

    return msg;
  }

  async findAll() {
    const msg = await myDataSource.getRepository(Messages).find();
    return msg
  }

  async findMsg(name: string, login: string )
  {
    const msg = await this.msgRepo.find({ relations: [ 'chan'] })
    let arr : any = [];
    msg.forEach(element => {
      if (element.chan.name == name)
      {
   //       if (!this.contactsService.block_bool(login, element.author.login))
            arr.push(element);
      }
    });
    return arr;
  }

  async identify(login: string, name:string)
  {
    const chan = await myDataSource.getRepository(Channel).findOne({where : {name:name}})
    const usr = await myDataSource.getRepository(User).findOne({where : {login:login}})
    const arr = await myDataSource.getRepository(ChanParticipant).find({relations : ['participants']});
    console.log(arr);
    //arr.forEach(element => {
    //if (element.participant.login == login && element.chan.name == name)
     // return ;
  //})
    const chanPart : ChanParticipant = new ChanParticipant;
    chanPart.participant = usr;
    chanPart.chan = chan;
  //  chan.participants.push(chanPart);
    await myDataSource.getRepository(ChanParticipant).save(chanPart);
  }
}
