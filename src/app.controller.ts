import { Controller, Get, Render, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index.html')
  RenderIndexPage(): void {
    Logger.log('Render index.html', 'View');
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
