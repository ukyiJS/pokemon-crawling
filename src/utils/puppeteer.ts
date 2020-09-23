import { Logger } from '@nestjs/common';
import { Browser, launch, Page } from 'puppeteer';

export interface BrowserAndPage {
  browser: Browser;
  page: Page;
}

export const getBrowserAndPage = async (url: string, waitForSelector: string): Promise<BrowserAndPage> => {
  const args = [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote',
    '--single-process',
  ];
  const browser = await launch({ headless: true, args });
  const page = await browser.newPage();

  Logger.log(`############################## Crawling Start ##############################`, 'Start');
  await page.goto(url);
  Logger.log(`${url}`, 'PageLoad');

  await page.waitForSelector(waitForSelector);

  return { browser, page };
};
