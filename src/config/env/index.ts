export interface DatabaseEnv {
  url: string;
}
export interface PuppeteerEnv {
  browserPath: string;
  profilePath?: string;
}
export interface CrawlingEnv {
  loopCount: number;
}
export interface Env {
  port: number;
  database: DatabaseEnv;
  puppeteer: PuppeteerEnv;
  crawling: CrawlingEnv;
}

export const envConfig = (): Env => ({
  port: +process.env.PORT!,
  database: {
    url: process.env.DATABASE_URL!,
  },
  puppeteer: {
    browserPath: process.env.PUPPETEER_BROWSER_PATH!,
    profilePath: process.env.PUPPETEER_PROFILE_PATH,
  },
  crawling: {
    loopCount: +process.env.LOOP_COUNT!,
  },
});
