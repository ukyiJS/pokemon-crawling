import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { blueBright } from 'chalk';
import { renderFile } from 'ejs';
import { join } from 'path';
import { AppModule } from './app.module';

const createServer = async () => {
  const app = await NestFactory.create<INestApplication & NestExpressApplication>(AppModule, { cors: true });
  const config = app.get(ConfigService);
  const port = config.get('port');

  app.engine('html', renderFile).set('view engine', 'html');
  await app
    .setBaseViewsDir(join(process.cwd(), 'src/views'))
    .useStaticAssets(join(process.cwd(), 'src/assets'))
    .useStaticAssets(join(process.cwd(), 'node_modules/axios/dist'))
    .listen(port);

  Logger.log(`🚀 Server running on ${blueBright(`http://localhost:${port}`)}`, 'Server', false);
};
createServer();
