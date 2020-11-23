import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { renderFile } from 'ejs';
import { join } from 'path';
import { AppModule } from './app.module';
import { LoggingInterceptor, TimeoutInterceptor } from './common';
import { PORT } from './env';
import { validateEnv } from './utils/validateEnv';

const createServer = async () => {
  validateEnv();
  const app = await NestFactory.create<INestApplication & NestExpressApplication>(AppModule, { cors: true });

  app.engine('html', renderFile).set('view engine', 'html');
  await app
    .setBaseViewsDir(join(__dirname, '../src', 'views'))
    .useStaticAssets(join(__dirname, '../src', 'assets'))
    .useStaticAssets(join(__dirname, '../node_modules'))
    .useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor())
    .listen(PORT);

  Logger.log(`Server running on http://localhost:${PORT}`, 'Server');
};
createServer();
