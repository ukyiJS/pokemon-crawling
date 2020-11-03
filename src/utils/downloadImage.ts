import { Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { createWriteStream, existsSync, mkdirSync, ReadStream } from 'fs';
import { join } from 'path';
import { ProgressBar } from '.';

type Image = {
  url: string;
  name: string;
  dirName?: string;
};

type DataToDownload = {
  url: string;
  fileName: string;
};

export class DownloadImage {
  constructor(readonly dir = join(process.cwd(), 'download')) {}

  public download = async (url: string, fileName: string): Promise<ReadStream> => {
    if (!existsSync(this.dir)) {
      mkdirSync(this.dir);
      Logger.log(this.dir, 'CreateDirectory');
    }

    const { data }: AxiosResponse<ReadStream> = await axios({ url, responseType: 'stream' });

    return new Promise((resolve, reject) => {
      data
        .pipe(createWriteStream(`${this.dir}/${fileName}`))
        .on('finish', resolve)
        .on('error', reject);
    });
  };

  public multipleDownloads = async (dataToDownloads: DataToDownload[]): Promise<ReadStream[]> => {
    let result = <ReadStream[]>[];
    const loading = new ProgressBar();
    const loadingSize = dataToDownloads.length;

    for (const [index, { url, fileName }] of dataToDownloads.entries()) {
      result = [...result, await this.download(url, fileName)];
      const cursor = index + 1;
      loading.update((cursor / loadingSize) * 100, fileName);
    }

    return result;
  };
}
