import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('me')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('miik')
  getmik() {
    return 'miik'
  }
}
