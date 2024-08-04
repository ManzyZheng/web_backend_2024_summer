import { Controller, Get } from '@midwayjs/core';

@Controller('/')
export class HomeController {
  @Get('/')
  async home(): Promise<string> {
    console.log('home');
    return 'Hello Midwayjs!';
  }
}
