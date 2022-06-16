import { Test, TestingModule } from '@nestjs/testing';
import { ChanParticipantsService } from './chan-participants.service';

describe('ChanParticipantsService', () => {
  let service: ChanParticipantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChanParticipantsService],
    }).compile();

    service = module.get<ChanParticipantsService>(ChanParticipantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
