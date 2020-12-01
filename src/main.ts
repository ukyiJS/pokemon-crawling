import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { blueBright } from 'chalk';
import { renderFile } from 'ejs';
import { join } from 'path';
import { AppModule } from './app.module';
import { PORT } from './env';
import { validateEnv } from './utils';

const createServer = async () => {
  validateEnv();
  const app = await NestFactory.create<INestApplication & NestExpressApplication>(AppModule, { cors: true });

  app.engine('html', renderFile).set('view engine', 'html');
  await app
    .setBaseViewsDir(join(process.cwd(), 'src/views'))
    .useStaticAssets(join(process.cwd(), 'src/assets'))
    .useStaticAssets(join(process.cwd(), 'node_modules/axios/dist'))
    .listen(PORT);

  Logger.log(`🚀 Server running on ${blueBright(`http://localhost:${PORT}`)}`, 'Server', false);
};
createServer();
