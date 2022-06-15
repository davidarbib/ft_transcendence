import { Module } from '@nestjs/common';
import { createDataService } from './createData.service';
import { createDataController } from './createData.controllers';

@Module({
  controllers: [createDataController],
  providers: [createDataService]
})
export class createDataModule {}