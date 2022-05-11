import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChanParticipantsService } from './chan-participants.service';
import { CreateChanParticipantDto } from './dto/create-chan-participant.dto';
import { UpdateChanParticipantDto } from './dto/update-chan-participant.dto';

@Controller('chan-participants')
export class ChanParticipantsController {
  constructor(private readonly chanParticipantsService: ChanParticipantsService) {}

  @Post()
  create(@Body() createChanParticipantDto: CreateChanParticipantDto) {
    return this.chanParticipantsService.create(createChanParticipantDto);
  }

  @Get()
  findAll() {
    return this.chanParticipantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chanParticipantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChanParticipantDto: UpdateChanParticipantDto) {
    return this.chanParticipantsService.update(id, updateChanParticipantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chanParticipantsService.remove(id);
  }
}
