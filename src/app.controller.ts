import { Controller, Get, Logger, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index.html')
  public index(): void {
    Logger.log('Render index.html', 'View');
  }
}
