import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { CreateChanParticipantDto } from './dto/create-chan-participant.dto';
import { UpdateChanParticipantDto } from './dto/update-chan-participant.dto';
import { ChanParticipant } from './entities/chan-participant.entity';

@Injectable()
export class ChanParticipantsService {
  create(createChanParticipantDto: CreateChanParticipantDto) {
    return 'This action adds a new chanParticipant';
  }

  findAll() {
    const chanPartRepo = myDataSource.getRepository(ChanParticipant)

    return chanPartRepo.find();
  }

  findOne(id: string) {
    const chanPartRepo = myDataSource.getRepository(ChanParticipant)
    return chanPartRepo.findOneBy({id});
  }

  update(id: string, updateChanParticipantDto: UpdateChanParticipantDto) {
    return `This action updates a #${id} chanParticipant`;
  }

  async remove(id: string) {
   /* const chanPartRepo = myDataSource.getRepository(ChanParticipant)
    const chanPartDelete = chanPartRepo
    return await chanPartRepo.delete(chanPartDelete);*/
  }
}
