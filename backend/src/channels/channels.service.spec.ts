import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ChannelsService } from './channels.service';

describe('ChannelsService', () => {
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        Repository,
      ],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
