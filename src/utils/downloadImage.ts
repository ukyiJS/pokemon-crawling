import { Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { createWriteStream, existsSync, mkdirSync, ReadStream } from 'fs';
import { join } from 'path';

type Image = {
  url: string;
  name: string;
  dirName?: string;
};

export const downloadImage = async ({ url, name, dirName = 'download' }: Image): Promise<ReadStream> => {
  const saveDir = join(process.cwd(), dirName);

  if (!existsSync(saveDir)) {
    mkdirSync(saveDir);
    Logger.log(saveDir, 'CreateDirectory');
  }

  const { data }: AxiosResponse<ReadStream> = await axios({ url, responseType: 'stream' });

  return new Promise((resolve, reject) => {
    data
      .pipe(createWriteStream(`${saveDir}/${name}`))
      .on('finish', resolve)
      .on('error', reject);

    Logger.log(name, 'Download');
  });
};
