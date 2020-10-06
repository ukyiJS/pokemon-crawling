import { Logger } from '@nestjs/common';
import { greenBright } from 'chalk';
import * as process from 'process';

const STDOUT = 'stdout';
const LOG = 'log';
type LoadingType = typeof STDOUT | typeof LOG;

export class LoadingBar {
  percent = 100;

  cursor = 0;

  type: LoadingType;

  constructor(type: LoadingType = STDOUT) {
    this.type = type;
    this.init();
  }

  init = (): void => {
    const dots = '\u2592'.repeat(this.cursor / 2);
    const left = this.percent / 2 - Math.floor(this.cursor / 2);
    const empty = '\u2591'.repeat(left);

    switch (this.type) {
      case LOG:
        Logger.log(greenBright(`\r[${dots}${empty}] ${this.cursor}%`), 'Progress');
        break;
      default:
        process.stdout.write(`\r[${dots}${empty}] ${this.cursor}%`);
        break;
    }
  };

  update = (cursor: number): void => {
    this.cursor = Math.floor(cursor);
    this.init();
  };
}
