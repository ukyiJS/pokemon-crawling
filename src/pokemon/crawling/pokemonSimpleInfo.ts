import { LoadingBar } from '@/utils/loadingBar';
import { Logger } from '@nestjs/common';
import { blueBright, redBright, whiteBright, yellowBright } from 'chalk';
import { join } from 'path';
import { Page } from 'puppeteer';
import { IPokemonSimpleInfo } from '../pokemon.interface';
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

    const $popupButton = await page.$('#gdpr-confirm > div > div > p.text-right > button');
    if ($popupButton) {
      Logger.log('############button', 'button');
      await page.click('#gdpr-confirm > div > div > p.text-right > button');
    }

    const loadingBar = new LoadingBar('log');
    do {
      await page.waitForSelector('#main');

      const pokemon = await page.evaluate(this.getPokemons, STAT, POKEMON_TYPE);
      pokemons = [...pokemons, pokemon];
      Logger.log(page.url(), 'url');

      currentCount = +pokemon.no;
      const percent = (currentCount / this.loopCount) * 100;
      const json = `${JSON.stringify(pokemon)}`
        .replace(/("(?=n|e|i|t|s|c|a|h|f|w|g|r|d|v)(\w)+")/g, (_, m1) => m1.replace(/"/g, ''))
        .replace(/([:,{](?!\/))/g, '$1 ')
        .replace(/([}])/g, ' $1')
        .replace(/([[\]{}])/g, blueBright('$1'))
        .replace(/(\w+:(?!\/))/g, yellowBright('$1'))
        .replace(/(null)/g, redBright('$1'));
      loadingBar.update(percent);
      Logger.log(whiteBright(json), 'Result');

      await page.waitForSelector(nextClickSelector);
      await page.click(nextClickSelector);
      await navigationPromise;
    } while (currentCount < this.loopCount);

    return pokemons;
  };

  private getPokemons = (STAT: STAT, POKEMON_TYPE: POKEMON_TYPE): IPokemonSimpleInfo => {
    const $element = document.querySelector('#main')!;

    const array = <T>($el: Iterable<T>): T[] => Array.from($el);
    const children = ($el: Element | null) => ($el ? Array.from($el.children) : []);
    const getText = ($el: Element | null): string => $el?.textContent?.trim() ?? '';
    const getTexts = ($el: NodeListOf<Element> | Element[]): string[] =>
      Array.from($el).reduce<string[]>((acc, $el, _, __, text = getText($el)) => (text ? [...acc, text] : acc), []);

    const [$tab, $panel] = children($element.querySelector('.tabset-basics'));
    const [$basics, ...$differentForm] = children($tab);

    const [
      [$image],
      [$no, $types, $species, $height, $weight, $abilities],
      [$evYield, $catchRate, $friendship, $exp],
      [$eegGroups, $gender, $eggCycles],
      $stats,
      $typeDefenses,
    ] = array($panel.querySelectorAll(`.active .grid-col:not(:nth-child(3))`)).reduce<Element[][]>(
      (acc, $el) => [...acc, ...($el.querySelector('table') ? [array($el.querySelectorAll('table td'))] : [[$el]])],
      [],
    );

    const name = getText($basics);
    const image = $image.querySelector('img')!.src;

    const no = getText($no);
    const types = getTexts(children($types));
    const species = getText($species).replace(/é/g, 'e');
    const height = getText($height).replace(/\(.*/g, '');
    const weight = getText($weight).replace(/\(.*/g, '');
    const abilities = getTexts($abilities.querySelectorAll('span > a'));
    const hiddenAbility = getText($abilities.querySelector('small > a')) || null;

    const evYield = getText($evYield);
    const catchRate = +getText($catchRate);
    const friendship = +getText($friendship).replace(/\(.*/, '');
    const exp = +getText($exp);

    const eegGroups = getText($eegGroups).split(',');
    const gender = getText($gender).split(',');
    const [cycle, step] = getText($eggCycles)
      .replace(/[,)]|steps/g, '')
      .split('(');
    const eggCycles = { cycle, step };

    const statNames = Object.keys(STAT);
    const stats = getTexts($stats.filter((_, i) => !(i % 4))).map((value, i) => ({
      name: statNames[i],
      value: +value,
    }));

    const typeDefenseNames = Object.keys(POKEMON_TYPE);
    const typeDefenses = $typeDefenses.map(($el, i) => {
      const type = typeDefenseNames[i];
      const damage = +(getText($el) || '1').replace(/(½)|(¼)/, (_, m1, m2) => (m1 && '0.5') || (m2 && '0.25'));
      return { type, damage };
    });

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
      exp,
      eegGroups,
      gender,
      eggCycles,
      stats,
      typeDefenses,
    } as IPokemonSimpleInfo;
  };
}
