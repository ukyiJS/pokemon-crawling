import { Logger } from '@nestjs/common';
import { bgGreenBright, cyanBright, greenBright, redBright, whiteBright, yellowBright } from 'chalk';
import { stdout } from 'process';

export const STDOUT = 'stdout';
export const LOG = 'log';
export type ProgressType = typeof STDOUT | typeof LOG;

export class ProgressBar {
  private percent = 100;
  private cursor = 0;
  private type: ProgressType;
  private color = whiteBright;

  constructor(type: ProgressType = STDOUT) {
    this.type = type;
  }

  private printProgress = (context = ''): void => {
    const dots = '\u2592'.repeat(this.cursor / 2);
    const left = this.percent / 2 - Math.floor(this.cursor / 2);
    const empty = '\u2591'.repeat(left);
    const progressBar = this.color(`\r[${dots}${empty}] ${this.cursor}%`);
    const label = context ? bgGreenBright.black(` ${context} `) : '';

    const message = `${progressBar} ${label}\r`;

    if (this.cursor === 100) {
      stdout.write(`${progressBar} ${bgGreenBright.black('Completion')}\r\n`);
      return;
    }
    switch (this.type) {
      case LOG:
        Logger.log(message, 'Progress');
        break;
      default:
        stdout.write(message);
        break;
    }
  };

  public update = (cursor: number, message?: string): void => {
    this.cursor = Math.floor(cursor);
    if (this.cursor < 33) this.color = redBright;
    else if (this.cursor < 66) this.color = yellowBright;
    else if (this.cursor < 100) this.color = cyanBright;
    else this.color = greenBright;

    this.printProgress(message);
  };
}
