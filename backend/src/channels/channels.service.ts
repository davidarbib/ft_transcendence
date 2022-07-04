import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { myDataSource } from 'src/app-data-source';
import { ChanParticipant, ChanPartStatus } from 'src/chan-participants/entities/chan-participant.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel, ChanType } from './entities/channel.entity';
import {HttpException, HttpStatus} from '@nestjs/common'
import { cachedDataVersionTag } from 'v8';
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChannelsService {
  async create(createChannel: CreateChannelDto, usr :User) {
    const chanPart : ChanParticipant = new ChanParticipant;
    chanPart.participant = usr;
    chanPart.chan = createChannel;
    chanPart.privilege = ChanPartStatus.OWNER;
    myDataSource.getRepository(Channel).save(createChannel);
    await myDataSource.getRepository(ChanParticipant).save(chanPart);
  }

  findAll() {

    return myDataSource.getRepository(Channel).find();
  }

  findOne(name:string) {
    return  myDataSource.getRepository(Channel).findOneBy({name});
  }

  async findChanPriv()
  {
    const test = await myDataSource.getRepository(Channel).find();
    let arr: any = [];
    test.forEach(element => {
      if (element.type == ChanType.PRIVATE)
        arr.push(element)
    });
    return arr;
  }
  async findChanPublic()
  {
      const test = await myDataSource.getRepository(Channel).find();
      let arr: any = [];
      test.forEach(element => {
        if (element.type == ChanType.PUBLIC)
          arr.push(element)
      });
      return arr;
  }
  
  async findChan(usr:User)
  {
    const test = await myDataSource.getRepository(ChanParticipant).find({ relations: ['participant', 'chan'] });
    let arr: any = [];
    test.forEach(element => {
      if (element.participant.login == usr.login)
        arr.push(element.chan)
    });
    return arr;
  }
  async update(name: string, updateChannelDto: UpdateChannelDto, usr : User, channel : Channel)
  {
    const chanPart = await myDataSource.getRepository(ChanParticipant).createQueryBuilder("chanpart")
    .leftJoinAndSelect("user.id", "test", "channel.id = :id", {id : channel.id,})
    .where("user.login = :login", {login : usr.login})
    .getOne()
    // const test = user.chanParticipants[channel.id]
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
