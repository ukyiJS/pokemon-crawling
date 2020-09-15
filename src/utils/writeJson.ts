import { Logger } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

type WriteJson = {
  data: any;
  fileName: string;
  dirName?: string;
};

export const writeJson = async ({ data, fileName, dirName = '' }: WriteJson): Promise<void> => {
  const saveDir = join(process.cwd(), dirName);
  const date = new Date();
  const time = `${date.getMonth() + 1}.${date.getDate()}_${date.getHours()}h${date.getMinutes()}m${date.getSeconds()}s`;
  const jsonFileName = `${saveDir}/${fileName}_${time}.json`;

  if (!existsSync(saveDir)) {
    mkdirSync(saveDir);
    Logger.log(saveDir, 'CreateDirectory');
  }

  writeFileSync(jsonFileName, JSON.stringify(data));
  Logger.log(jsonFileName, 'WriteFile');
};
