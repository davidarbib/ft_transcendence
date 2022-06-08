import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { Messages } from 'src/messages/entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { ChanParticipant } from 'src/chan-participants/entities/chan-participant.entity';
import { channel } from 'diagnostics_channel';


@Injectable()
export class MessagesService {
 
  constructor (
    private msgRepo : Repository<Messages>,
  )
  {
    this.msgRepo = myDataSource.getRepository(Messages);
  }
  async create(usr:User ,name: string, createMessageDto: CreateMessageDto) {

    const chan  = await myDataSource.getRepository(Channel).findOne({where : {name : name}})
      createMessageDto.author = usr;
      createMessageDto.time = new Date();
      createMessageDto.chan = chan; 
      myDataSource.getRepository(Channel).save(chan);
      const msg = await this.msgRepo.create(createMessageDto)
      chan.messages.push(msg);
      await myDataSource.getRepository(channel).save(chan);

    return msg;
  }

  findAll() {
    return this.msgRepo;
  }

  async identify(name: string, usr:User)
  {

    const chan = await myDataSource.getRepository(Channel).findOne({where : {name:name}})
    const chanPart : ChanParticipant = new ChanParticipant;
    chanPart.participant = usr;
    chanPart.chan = chan;
    chan.participants.push(chanPart);
    await myDataSource.getRepository(Channel).save(chan);
    await myDataSource.getRepository(ChanParticipant).create(chanPart);
  }
}
