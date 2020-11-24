import { Logger } from '@nestjs/common';
import axios, { AxiosPromise } from 'axios';
import { createWriteStream, existsSync, mkdirSync, ReadStream } from 'fs';
import { join } from 'path';

export type DataToDownload = {
  no?: string;
  url: string;
  fileName: string;
};

export class DownloadImage {
  public download = async (url: string, fileName: string, dirName = 'download'): Promise<void> => {
    const downloadDir = join(process.cwd(), 'download');
    if (!existsSync(downloadDir)) {
      mkdirSync(downloadDir);
      Logger.log(downloadDir, 'CreateDirectory');
    }
    const dir = join(process.cwd(), dirName);
    if (!existsSync(dir)) {
      mkdirSync(dir);
      Logger.log(dir, 'CreateDirectory');
    }

    let download = <ReadStream>{};
    try {
      const { data } = await (<AxiosPromise<ReadStream>>axios({ url, responseType: 'stream' }));
      download = data;
    } catch (error) {
      Logger.error(error.message, error.stack, 'Download Error');
      return undefined;
    }

    return new Promise(resolve => {
      download
        .pipe(createWriteStream(`${dir}/${fileName}`))
        .on('finish', resolve)
        .on('error', error => Logger.error(error.message, error.stack, error.name));
    });
  };
}
