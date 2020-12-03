import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer-extra/dist/puppeteer';
import { ObjectLiteral } from 'typeorm';

export class CrawlingUtil {
  public onPageClick = async (page: Page, selector: string): Promise<void> => {
    try {
      await page.waitForSelector(selector);
      await Promise.all([page.click(selector), page.waitForNavigation({ waitUntil: 'load', timeout: 10000 })]);
    } catch (error) {
      if (error.name !== 'TimeoutError') throw error;
      Logger.error(error.message, error.stack, error.name);
    }
  };

  public getUniqueObjectArray = <T>(objectArray: T[], key: string): T[] => {
    return [...new Map(objectArray.map(item => [(<ObjectLiteral>item)[key], item])).values()];
  };
}
