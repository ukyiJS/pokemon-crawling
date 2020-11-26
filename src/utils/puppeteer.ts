import { EXECUTABLE_PATH, PROFILE_PATH } from '@/env';
import { Logger, LogLevel } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import adblocker from 'puppeteer-extra-plugin-adblocker';
import { Browser, LaunchOptions, Page } from 'puppeteer-extra/dist/puppeteer';

puppeteer.use(adblocker({ blockTrackers: true }));

export class Puppeteer {
  constructor(private readonly url: string, private readonly options: LaunchOptions = {}) {}

  public init = async (): Promise<{ browser: Browser; page: Page }> => {
    const browser = await this.initBrowser();
    const page = await this.initPage(browser);

    return { browser, page };
  };
  private initBrowser = async (): Promise<Browser> => {
    const width = 1920;
    const height = 1080;
    const windowSize = `--window-size${width},${height}`;
    const {
      executablePath = EXECUTABLE_PATH,
      userDataDir = PROFILE_PATH,
      headless = false,
      devtools = true,
      defaultViewport = { width, height },
      timeout = 0,
      args = [],
    } = this.options;

    return puppeteer.launch({
      executablePath,
      userDataDir,
      headless,
      devtools,
      defaultViewport,
      timeout,
      args: [...args, windowSize],
    });
  };
  private initPage = async (browser: Browser): Promise<Page> => {
    const page = await browser.newPage();
    this.onPage(page);
    await page.goto(this.url, { waitUntil: 'load' });

    return page;
  };
  private onPage = (page: Page): void => {
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
    page.on('error', error => Logger.error(`❌ ${error}`, undefined, 'PageError'));
    page.once('close', () => Logger.log('✅ Page is closed', 'PageClose'));
  };
}
