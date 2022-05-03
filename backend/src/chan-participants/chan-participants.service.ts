import { Injectable } from '@nestjs/common';
import { CreateChanParticipantDto } from './dto/create-chan-participant.dto';
import { UpdateChanParticipantDto } from './dto/update-chan-participant.dto';

@Injectable()
export class ChanParticipantsService {
  create(createChanParticipantDto: CreateChanParticipantDto) {
    return 'This action adds a new chanParticipant';
  }

  findAll() {
    return `This action returns all chanParticipants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chanParticipant`;
  }

  update(id: number, updateChanParticipantDto: UpdateChanParticipantDto) {
    return `This action updates a #${id} chanParticipant`;
  }

  remove(id: number) {
    return `This action removes a #${id} chanParticipant`;
  }
}
