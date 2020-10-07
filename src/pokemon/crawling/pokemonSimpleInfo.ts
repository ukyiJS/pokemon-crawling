import { Logger } from '@nestjs/common';
import { whiteBright } from 'chalk';
import { Page } from 'puppeteer';
import { IPokemonSimpleInfo, IWindow } from '../pokemon.interface';
import { POKEMON_TYPE, STAT } from '../pokemon.type';
import { CrawlingUtil } from './utils';

declare let window: IWindow;

export class PokemonSimpleInfo extends CrawlingUtil {
  private loopCount: number;

  private page: Page;

  constructor(page: Page, loopCount = 893) {
    super();
    this.loopCount = loopCount;
    this.page = page;
    this.initLoading(loopCount);
  }

  private initLocalStorage = async (): Promise<void> => {
    await this.page.evaluate(() => localStorage.setItem('gdpr', '0'));
    Logger.log('gdpr = 0', 'LocalStorage');
    await this.page.reload();
    Logger.log('page is reloaded', 'Reload');
  };

  private initCrawlingUtils = (): Promise<void> =>
    this.page.evaluate(utils => Object.entries(utils).forEach(([key, value]) => (window[key] = value)), {
      STAT,
      POKEMON_TYPE,
    });

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
    const $grid = array($panel.querySelectorAll(`.active .grid-col:not(:nth-child(3))`));
    const $columns = $grid.reduce<Element[][]>((acc, $el) => {
      const isTable = $el.querySelector('table');
      const tableDataCell = array($el.querySelectorAll('table td'));
      return [...acc, isTable ? tableDataCell : [$el]];
    }, []);

    const [
      [$image],
      [$no, $types, $species, $height, $weight, $abilities],
      [$evYield, $catchRate, $friendship, $exp],
      [$eegGroups, $gender, $eggCycles],
      $stats,
      $typeDefenses,
    ] = $columns;

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

    const statNames = Object.values(STAT);
    const stats = getTexts($stats.filter((_, i) => !(i % 4))).map((value, i) => ({
      name: statNames[i],
      value: +value,
    }));

    const typeDefenseNames = Object.values(POKEMON_TYPE);
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
