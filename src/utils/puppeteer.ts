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

  page.once('domcontentloaded', () => Logger.log('✅ DOM is ready', 'DomcontentLoad'));
  page.once('load', () => Logger.log(`✅ Page is Loaded`, 'PageLoad'));
  page.on('console', message => Logger.log(`👉 ${message.text()}`, 'Console'));
  page.on('dialog', async dialog => {
    Logger.log(`👉 ${dialog.message()}`, 'Dialog');
    await dialog.dismiss();
  });
  page.on('popup', () => Logger.log('👉 New page is opened', 'Popup'));
  page.on('error', error => Logger.error(`❌ ${error}`, undefined, 'Error'));
  page.on('pageerror', error => Logger.error(`❌ ${error}`, undefined, 'PageError'));
  page.once('close', () => Logger.log('✅ Page is closed', 'PageClose'));

  Logger.log(`############################## Crawling Start ##############################`, 'Start');
  await page.goto(url);

  await page.waitForSelector(waitForSelector);

  return { browser, page };
};
