import { Browser, launch, Page } from 'puppeteer';
import { Logger } from '@nestjs/common';

declare let window: IWindow;
export interface IWindow extends Window {
  [key: string]: any;
}

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type ObjectLiteral<T> = {
  [key: string]: T;
};

export type BrowserAndPage = {
  browser: Browser;
  page: Page;
};

export type GetElement = (selector: string) => Element;
export type GetElements = (selector: string) => Element[];

export const registerUtils = async (page: Page, fn: ObjectLiteral<any>): Promise<void> => {
  const utils = Object.entries(fn).reduce((acc, [key, value]) => ({ ...acc, [key]: value.toString() }), {});
  await page.evaluate((utils: ObjectLiteral<string>) => {
    const runnable = (fnStr: string) => new Function('arguments', `return ${fnStr}(arguments)`);
    (Object.entries(utils) as Entries<ObjectLiteral<string>>).forEach(([key, value]) => {
      window[key] = runnable(value);
    });
  }, utils);
};

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
