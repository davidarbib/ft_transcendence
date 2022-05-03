import { PartialType } from '@nestjs/swagger';
import { CreateChanParticipantDto } from './create-chan-participant.dto';

export class UpdateChanParticipantDto extends PartialType(CreateChanParticipantDto) {}
