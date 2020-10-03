import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer';
import { IPokemonWiki } from '../pokemon.interface';

export class PokemonWiki {
  private loopCount: number;

  constructor(loopCount = 892) {
    this.loopCount = loopCount;
  }

  public crawling = async (page: Page): Promise<IPokemonWiki[]> => {
    let currentCount = 0;
    let pokemons: IPokemonWiki[] = [];

    const nextClickSelector = 'table.w-100.mb-1 td:nth-child(3) td:nth-child(1) > a';
    const navigationPromise = page.waitForNavigation();

    do {
      const $infobox = await page.waitForSelector('.infobox-pokemon');
      const pokemon = await page.evaluate(this.getPokemons, $infobox);
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

  private getPokemons = ($element: Element): IPokemonWiki => {};
}
