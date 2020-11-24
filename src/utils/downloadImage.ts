import { Logger } from '@nestjs/common';
import axios, { AxiosPromise } from 'axios';
import { createWriteStream, existsSync, mkdirSync, ReadStream } from 'fs';
import { join } from 'path';
import { ProgressBar } from '.';

export type DataToDownload = {
  url: string;
  fileName: string;
};

export class DownloadImage {
  constructor(readonly dir = join(process.cwd(), 'download')) {}

  public download = async (url: string, fileName: string): Promise<ReadStream | null> => {
    if (!existsSync(this.dir)) {
      mkdirSync(this.dir);
      Logger.log(this.dir, 'CreateDirectory');
    }

    let download = <ReadStream>{};
    try {
      const { data } = await (<AxiosPromise<ReadStream>>axios({ url, responseType: 'stream' }));
      download = data;
    } catch (error) {
      Logger.error(error.message, error.stack, 'Download Error');
      return null;
    }

    return new Promise(resolve => {
      download
        .pipe(createWriteStream(`${this.dir}/${fileName}`))
        .on('finish', resolve)
        .on('error', error => Logger.error(error.message, error.stack, error.name));
    });
  };

  public multipleDownloads = async (dataToDownloads: DataToDownload[]): Promise<ReadStream[]> => {
    let result = <ReadStream[]>[];
    const loading = new ProgressBar();
    const loadingSize = dataToDownloads.length;

    for (const [index, { url, fileName }] of dataToDownloads.entries()) {
      const download = await this.download(url, fileName);
      const cursor = index + 1;
      Logger.log(`${cursor} : ${fileName}`, 'Download');
      loading.update((cursor / loadingSize) * 100);

      if (!download) continue;
      result = [...result, download];
    }

    return result;
  };
}
