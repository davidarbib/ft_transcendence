import { Test, TestingModule } from '@nestjs/testing';
import { ChanParticipantsController } from './chan-participants.controller';
import { ChanParticipantsService } from './chan-participants.service';

describe('ChanParticipantsController', () => {
  let controller: ChanParticipantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChanParticipantsController],
      providers: [ChanParticipantsService],
    }).compile();

    controller = module.get<ChanParticipantsController>(ChanParticipantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
