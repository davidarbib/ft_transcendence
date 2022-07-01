import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('zzz')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('Hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
