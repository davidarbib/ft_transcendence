import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { myDataSource } from 'src/app-data-source';
import { CreateChanParticipantDto } from './dto/create-chan-participant.dto';
import { UpdateChanParticipantDto } from './dto/update-chan-participant.dto';
import { ChanParticipant } from './entities/chan-participant.entity';

@Injectable()
export class ChanParticipantsService {
  create(createChanParticipantDto: CreateChanParticipantDto) {
    return myDataSource.getRepository(ChanParticipant).save(createChanParticipantDto);
  }
/*
  findAll() {
    const chanPartRepo = myDataSource.getRepository(ChanParticipant)

    return chanPartRepo.find();
  }
*/
/*
  async findOne(name: string) {
    const chanPartRepo = myDataSource.getRepository(ChanParticipant)
    return chanPartRepo.findOneBy({name});
  }
*/
  async update(id: string, updateChanParticipantDto: UpdateChanParticipantDto, chanPart : ChanParticipant) {
    
    let date =   new Date;  
    const {privilege, ban, mute} = updateChanParticipantDto;
    chanPart.privilege = privilege;
     chanPart.ban = ban;
     chanPart.mute = mute;
     chanPart.end_timestamp = new Date(date.setTime(3));
   return await myDataSource.getRepository(ChanParticipant).save(chanPart);
  }

  async remove(id: string) {
    const chanPartRepo = myDataSource.getRepository(ChanParticipant)
    const chanPartDelete = await chanPartRepo.findOneBy({id});
    return chanPartDelete.remove();
  }
}
