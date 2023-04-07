import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {
  @Get('/api/test')
  getHello(): string {
    return 'test';
  }
}
