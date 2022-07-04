import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ChanParticipantsService } from './chan-participants.service';

describe('ChanParticipantsService', () => {
  let service: ChanParticipantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChanParticipantsService,
        Repository,
      ],
    }).compile();

    service = module.get<ChanParticipantsService>(ChanParticipantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
