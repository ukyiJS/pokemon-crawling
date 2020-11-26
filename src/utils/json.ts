import { Logger } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface WriteJson {
  data: any;
  fileName: string;
  dirName?: string;
}

interface GetJson {
  dirName?: string;
  fileName: string;
}

interface MergedJson {
  fileNames: string[];
  dirName?: string;
}

const fileOptions = { encoding: 'utf-8' };

export const getJson = <T>({ fileName, dirName = 'src/assets/json' }: GetJson): T | null => {
  const dir = join(process.cwd(), dirName, fileName);
  const isExists = existsSync(dir);
  return isExists ? <T>JSON.parse(readFileSync(dir, fileOptions)) : null;
};

export const mergeJson = <T>({ fileNames, dirName = 'src/assets/json' }: MergedJson): T[] => {
  const dir = join(process.cwd(), dirName);
  return fileNames.map<T>(json => JSON.parse(readFileSync(join(dir, json), fileOptions)));
};

export const writeJson = ({ data, fileName, dirName = '' }: WriteJson): void => {
  const saveDir = join(process.cwd(), dirName);
  const jsonFileName = `${saveDir}/${fileName}.json`;

  if (!existsSync(saveDir)) {
    mkdirSync(saveDir);
    Logger.log(saveDir, 'CreateDirectory');
  }

  writeFileSync(jsonFileName, JSON.stringify(data));
  Logger.log(jsonFileName, 'WriteFile');
};
