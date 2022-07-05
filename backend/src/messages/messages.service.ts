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

  async findAll() {
    const msg = await myDataSource.getRepository(Messages).find();
    return msg
  }

  async findMsg(name: string, login: string )
  {
    const msg = await this.msgRepo.find({ relations: [ 'chan'] })
    let arr : any = [];
    msg.forEach(element => {
      if (element.chan)
      {
     if (element.chan.name == name)
      {
        //      if (!this.contactsService.block_bool(login, element.author.login))
        arr.push(element);
      }
    }
    });
    return arr;
  }

  async identify(login: string, name:string, client :Socket)
  {
    const chan = await myDataSource.getRepository(Channel).findOne({where : {name:name}})
    const usr = await myDataSource.getRepository(User).findOne({where : {login:login}})
    const arr = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant']});
    arr.forEach(element => {
  if (element.participant.login == login && element.chan.name == name)
      return  1;
  })
    const chanPart : ChanParticipant = new ChanParticipant;
    chanPart.participant = usr;
    chanPart.chan = chan;
  //  chan.participants.push(chanPart);
    await myDataSource.getRepository(ChanParticipant).save(chanPart);
  
    return  0;
  }
}
