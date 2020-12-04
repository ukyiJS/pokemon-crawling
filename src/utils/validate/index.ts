import { object, string, number } from '@hapi/joi';

enum Environment {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

export const validationSchema = object({
  NODE_ENV: string()
    .valid(...Object.values(Environment))
    .default(Environment.DEV),
  PORT: number().default(3000),
  DATABASE_URL: string().required(),
  PUPPETEER_BROWSER_PATH: string().required(),
  PUPPETEER_PROFILE_PATH: string(),
  LOOP_COUNT: number().max(897).default(893),
});
