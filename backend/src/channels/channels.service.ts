import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { myDataSource } from 'src/app-data-source';
import { ChanParticipant, ChanPartStatus } from 'src/chan-participants/entities/chan-participant.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';
import {HttpException, HttpStatus} from '@nestjs/common'

@Injectable()
export class ChannelsService {
  create(createChannel: CreateChannelDto, usr :User) {
    const chanPart : ChanParticipant = new ChanParticipant;
    chanPart.participant = usr;
    chanPart.chan = createChannel;
    chanPart.privilege = ChanPartStatus.OWNER;
    usr.chanParticipations.push(chanPart);
    createChannel.participants.push(chanPart);
    return myDataSource.getRepository(Channel).save(createChannel);
  }

  findAll() {

    return myDataSource.getRepository(Channel).find();
  }

  findOne(name:string) {
    return  myDataSource.getRepository(Channel).findOneBy({name});
  }

  async update(name: string, updateChannelDto: UpdateChannelDto, usr : User, channel : Channel)
  {
    const chanPart = await myDataSource.getRepository(ChanParticipant).createQueryBuilder("chanpart")
    .leftJoinAndSelect("user.id", "test", "channel.id = :id", {id : channel.id,})
    .where("user.login = :login", {login : usr.login})
    .getOne()
    if (chanPart.privilege != ChanPartStatus.OWNER)
    throw new HttpException ({
      status: HttpStatus.FORBIDDEN,
      error: 'NOT ALLOWED',
    }, HttpStatus.FORBIDDEN);
    const chanToUpdate = await myDataSource.getRepository(Channel).findOneBy({name});
    const {type, password} = updateChannelDto;
    chanToUpdate.type =  type;
    chanToUpdate.password =  password;
    return myDataSource.getRepository(Channel).save(chanToUpdate);
  }
/*
  async remove(name: string) {
    const chanDelete = await myDataSource.getRepository(Channel).findOneBy({id})
    return chanDelete.remove();
  }*/
}
