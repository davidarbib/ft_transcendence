import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { myDataSource } from 'src/app-data-source';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
  create(createChannelDto: CreateChannelDto) {
    return myDataSource.getRepository(Channel).save(createChannelDto);
  }

  findAll() {

    return myDataSource.getRepository(Channel).find();
  }

  findOne(id:string) {
    return  myDataSource.getRepository(Channel).findOneBy({id});
  }

  update(id: string, updateChannelDto: UpdateChannelDto) {
    const chanToUpdate = myDataSource.getRepository(Channel).findOneBy({id});
    const {name, password} = updateChannelDto;
   // chanToUpdate.name = 
    return `This action updates a #${id} channel`;
  }

  async remove(id: string) {
    const chanDelete = await myDataSource.getRepository(Channel).findOneBy({id})
    return chanDelete.remove();
  }
}
