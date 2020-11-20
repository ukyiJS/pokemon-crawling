import { Logger, LogLevel } from '@nestjs/common';
import { Browser, launch, Page } from 'puppeteer';

export interface BrowserAndPage {
  browser: Browser;
  page: Page;
}

const width = 1920;
const height = 1080;

export class PuppeteerUtil {
  public getBrowserAndPage = async (url: string, waitForSelector: string): Promise<BrowserAndPage> => {
    const browser = await launch({
      executablePath: '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
      userDataDir: '/mnt/c/Users/ukyi/AppData/Local/Google/Chrome/User Data',
      headless: false,
      devtools: true,
      defaultViewport: { width, height },
      timeout: 0,
      args: [`--window-size${width},${height}`],
      // args: [
      //   '--disable-gpu',
      //   '--disable-dev-shm-usage',
      //   '--disable-setuid-sandbox',
      //   '--no-first-run',
      //   '--no-sandbox',
      //   '--no-zygote',
      //   '--single-process',
      // ],
    });
    const page = await browser.newPage();
    this.addPageEvent(page);

    Logger.log(`############################## Crawling Start ##############################`, 'Start');
    await page.goto(url, { waitUntil: 'load' });

    await page.waitForSelector(waitForSelector);

    return { browser, page };
  };

  private addPageEvent = (page: Page): void => {
    page.once('domcontentloaded', () => Logger.log('✅ DOM is ready', 'DomcontentLoad'));
    page.once('load', () => Logger.log(`✅ Page is Loaded`, 'PageLoad'));
    page.on('console', message => {
      const regExp = /^A parser-blocking|^Failed|^Access to|^No targeting|^SG Installed|^guaTrackEvent|^Created ad|^Powered by|^tracker|^Aff Overrides|^Use of|^\[AdEngine\]|^isUapResolved|^MediaWiki|^JQMIGRATE|^Watch Shows|^This page|^\[amp-analytics\/transport\]|^\[5a0391aab23c0a5\]|^\[Report Only\]|^fun-hooks|^%cAd URL:%c|^bkTags|^loaded|^\[amp-story-auto-ads:ui\]|^\[DOM\] Found 2 elements/gi;
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
    page.once('close', () => Logger.log('✅ Page is closed', 'PageClose'));
  };
}
