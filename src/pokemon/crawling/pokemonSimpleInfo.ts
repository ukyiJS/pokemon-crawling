import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer';
import { IPokemonSimpleInfo } from '../pokemon.interface';

export class PokemonSimpleInfo {
  private loopCount: number;

  constructor(loopCount = 892) {
    this.loopCount = loopCount;
  }

  public crawling = async (page: Page): Promise<IPokemonSimpleInfo[]> => {
    let currentCount = 0;
    let pokemons: IPokemonSimpleInfo[] = [];

    const nextClickSelector = '.entity-nav-next';
    const navigationPromise = page.waitForNavigation();

    do {
      const $main = await page.waitForSelector('#main');
      const pokemon = await page.evaluate(this.getPokemons, $main);
      pokemons = [...pokemons, pokemon];

      currentCount = +pokemon.no;
      Logger.warn(this.loopCount, 'loopCount');

      const percent = `${Math.floor((currentCount / this.loopCount) * 100)}%`;
      Logger.debug(`${JSON.stringify(pokemon)}`, 'Result');
      Logger.verbose(`############################## ${percent} ##############################`, 'Result');

      await page.waitForSelector(nextClickSelector);
      await page.click(nextClickSelector);
      await navigationPromise;
    } while (currentCount < this.loopCount);

    return pokemons;
  };

  private getPokemons = ($element: Element): IPokemonSimpleInfo => {
    return {} as IPokemonSimpleInfo;
  };
}
