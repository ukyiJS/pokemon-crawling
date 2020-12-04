import { Module } from '@nestjs/common';
import { CrawlingService } from './crawling.service';

@Module({
  providers: [CrawlingService],
  exports: [CrawlingService],
})
export class CrawlingModule {}
