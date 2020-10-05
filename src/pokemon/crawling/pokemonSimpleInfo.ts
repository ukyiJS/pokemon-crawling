import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer';
import { IMoves, IPokemonSimpleInfo } from '../pokemon.interface';
import { POKEMON_TYPE, STAT } from '../pokemon.type';

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
    const array = <T>($el: Iterable<T>): T[] => Array.from($el);
    const children = ($el: Element | null) => ($el ? Array.from($el.children) : []);
    const getText = ($el: Element, regExp?: RegExp | null, str?: string): string =>
      $el.textContent!.replace(regExp === null ? '' : /\s/g, '').replace(RegExp(regExp ?? '', 'gi'), str ?? '');
    const getTexts = ($el: NodeListOf<Element> | Element[]): string[] => array($el).map($el => getText($el));

    const [$tab, $panel] = children($element.querySelector('.tabset-basics'));
    const [$basics, ...$differentForm] = children($tab);

    const [
      [$image],
      [$no, $types, $species, $height, $weight, $abilities],
      [$evYield, $catchRate, $friendship],
    ] = array($panel.querySelectorAll(`.active .grid-col:not(:nth-child(3))`)).reduce<Element[][]>(
      (acc, $el) => [...acc, ...($el.querySelector('table') ? [array($el.querySelectorAll('table td'))] : [[$el]])],
      [],
    );

    const name = getText($basics);
    const image = $image.querySelector('img')!.src;
    const no = getText($no);
    const types = getTexts(children($types));
    const species = getText($species, /é/, 'e');
    const height = getText($height, /\(.*/);
    const weight = getText($weight, /\(.*/);
    const abilities = getTexts($abilities.firstElementChild!.querySelectorAll('a'));
    const hiddenAbility = getText($abilities.querySelector('small a')!);
    const evYield = getText($evYield, null).trim();
    const catchRate = +getText($catchRate, null);
    const friendship = +getText($friendship, /\(.*/);

    return {
      name,
      image,
      no,
      types,
      species,
      height,
      weight,
      abilities,
      hiddenAbility,
      evYield,
      catchRate,
      friendship,
    } as IPokemonSimpleInfo;
  };
}
