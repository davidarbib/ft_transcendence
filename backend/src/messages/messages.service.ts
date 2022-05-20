import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { Channel } from 'src/channels/entities/channel.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  create(createMessageDto: CreateMessageDto) {
    return myDataSource.getRepository(Message).save(createMessageDto);
  }

  findAll() {
    return myDataSource.getRepository(Message).find();
  }

  findOne(id: string) {
    return myDataSource.getRepository(Message).findOneBy({id});
  }

  async update(id:string, updateMessageDto: UpdateMessageDto) {
    const msgRepo = myDataSource.getRepository(Message);
    const msgToUpdate = await msgRepo.findOneBy({id});
    const {content, author, chan} = updateMessageDto;
    msgToUpdate.content = content;
    msgToUpdate.author = author;
    msgToUpdate.chan = chan;
    myDataSource.getRepository(Channel).save(msgToUpdate);
  }

  async remove(id:string) {

    const messRepo = myDataSource.getRepository(Channel);
    const msgToRemove = await messRepo.findOneBy({id});

    return msgToRemove.remove();
  }

  async insertMsg() : Promise<string>
  {
    const msg : Message = new Message;
    msg.content =  'cc dav c le back end ki parle';
    msg.time = new Date();
    await myDataSource.getRepository(Message).save(msg);
    console.log("my msg is created");
    return "my msg is ok";
  }
}
