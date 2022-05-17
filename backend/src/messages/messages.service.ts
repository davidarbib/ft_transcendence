import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
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
