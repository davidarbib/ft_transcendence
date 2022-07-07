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
    
    let date =   new Date(Date.now());
    date.setHours(date.getHours() +2);
    const {mute, ban} = updateChanParticipantDto;
     chanPart.mute = mute;
     chanPart.ban = ban;
     if ( mute == true  || ban == true)
     chanPart.end_timestamp = date;
     if (mute == false && ban ==false)
       chanPart.end_timestamp = new Date(null);

   return await myDataSource.getRepository(ChanParticipant).save(chanPart);
  }

  async remove(id: string) {
    const chanPartRepo = myDataSource.getRepository(ChanParticipant)
    const chanPartDelete = await chanPartRepo.findOneBy({id});
    return chanPartDelete.remove();
  }
}
