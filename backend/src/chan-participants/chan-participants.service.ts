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

  findAll() {
    const chanPartRepo = myDataSource.getRepository(ChanParticipant)

    return chanPartRepo.find();
  }

  findOne(id: string) {
    const chanPartRepo = myDataSource.getRepository(ChanParticipant)
    return chanPartRepo.findOneBy({id});
  }

  async update(id: string, updateChanParticipantDto: UpdateChanParticipantDto) {
    const chanPartRepo = myDataSource.getRepository(ChanParticipant)
    const chanToUpdate = await chanPartRepo.findOneBy({id});
    const {admin,mute, ban, participant, chan} = updateChanParticipantDto;
    chanToUpdate.admin = admin;
    chanToUpdate.mute = mute;
    chanToUpdate.ban = ban;
    chanToUpdate.participant = participant;
    chanToUpdate.chan = chan;
    myDataSource.getRepository(ChanParticipant).save(chanToUpdate);
    return `This action updates a #${id} chanParticipant`;
  }

  async remove(id: string) {
    const chanPartRepo = myDataSource.getRepository(ChanParticipant)
    const chanPartDelete = await chanPartRepo.findOneBy({id});
    return chanPartDelete.remove();
  }
}
