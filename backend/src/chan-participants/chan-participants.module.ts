import { Module } from '@nestjs/common';
import { ChanParticipantsService } from './chan-participants.service';
import { ChanParticipantsController } from './chan-participants.controller';

@Module({
  controllers: [ChanParticipantsController],
  providers: [ChanParticipantsService]
})
export class ChanParticipantsModule {}
