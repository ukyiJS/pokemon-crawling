import { Logger, LogLevel } from '@nestjs/common';
import { Browser, launch, Page } from 'puppeteer';

export interface BrowserAndPage {
  browser: Browser;
  page: Page;
}

export class PuppeteerUtil {
  public getBrowserAndPage = async (url: string, waitForSelector: string): Promise<BrowserAndPage> => {
    const browser = await launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
      ],
    });
    const page = await browser.newPage();
    this.addPageEvent(page);

    Logger.log(`############################## Crawling Start ##############################`, 'Start');
    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    await page.waitForSelector(waitForSelector);

    return { browser, page };
  };

  private addPageEvent = (page: Page): void => {
    page.once('domcontentloaded', () => Logger.log('✅ DOM is ready', 'DomcontentLoad'));
    page.once('load', () => Logger.log(`✅ Page is Loaded`, 'PageLoad'));
    page.on('console', message => {
      const regExp = /^A parser-blocking|^Failed|^Access to|^No targeting|^SG Installed|^guaTrackEvent|^Created ad|^Powered by|^tracker|^Aff Overrides/gi;
      if (regExp.test(message.text())) return;
      const LoggerKeys: Array<LogLevel> = ['log', 'error', 'warn', 'debug', 'verbose'];
      const LoggerType = LoggerKeys.find(key => new RegExp(key, 'gi').test(message.type())) ?? 'log';

      if (LoggerType === 'error') {
        Logger.error(`❌ ${message.text()}`, undefined, 'Error');
        return;
      }
      Logger[LoggerType](`👉 ${message.text()}`, 'Console');
    });
    page.on('dialog', async dialog => {
      Logger.log(`👉 ${dialog.message()}`, 'Dialog');
      await dialog.dismiss();
    });
    page.on('popup', () => Logger.log('👉 New page is opened', 'Popup'));
    page.on('error', error => Logger.error(`❌ ${error}`, undefined, 'Error'));
    page.on('pageerror', error => Logger.error(`❌ ${error}`, undefined, 'PageError'));
    page.once('close', () => Logger.log('✅ Page is closed', 'PageClose'));
  };
}
