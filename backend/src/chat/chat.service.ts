import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { Message } from 'src/messages/entities/message.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { ChanParticipant } from 'src/chan-participants/entities/chan-participant.entity';


@Injectable()
export class ChatService {
 
  constructor (
    private msgRepo : Repository<Message>,
  )
  {
    this.msgRepo = myDataSource.getRepository(Message);
  }
  create(usr:User ,createChatDto: CreateChatDto) {

      createChatDto.author = usr;
      createChatDto.time = new Date();
      //il nous faut le channel pour mettre le message 
      this.msgRepo.save(createChatDto)
    return ;
  }

  findAll() {
    return this.msgRepo;
  }

  async identify(name: string, usr:User)
  {

    const chan = await myDataSource.getRepository(Channel).find({where : {name:name}})
    const chanPart : ChanParticipant = new ChanParticipant;
    chanPart.participant = usr;
    chanPart.chan = chan;
    chan.participant.push(chanPart);
    await myDataSource.getRepository(Channel).save(chan);
    await myDataSource.getRepository(ChanParticipant).save(chanPart);

  }
}
