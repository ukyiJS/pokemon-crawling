import { Logger } from '@nestjs/common';
import { whiteBright } from 'chalk';
import { Page } from 'puppeteer';
import { ObjectLiteral } from 'typeorm';
import { IMoves, IPokemonSimpleInfo, IWindow } from '../pokemon.interface';
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

  private initLocalStorage = async (localStorageItems: ObjectLiteral[]): Promise<void> => {
    await this.page.evaluate<(items: ObjectLiteral[]) => void>(items => {
      items.forEach(item =>
        Object.entries(item).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value))),
      );
    }, localStorageItems);
    Logger.log(localStorageItems, 'LocalStorage');
    await this.page.reload();
    Logger.log('page is reloaded', 'Reload');
  };

  private initCrawlingUtils = (): Promise<void> =>
    this.page.evaluate(utils => Object.entries(utils).forEach(([key, value]) => (window[key] = value)), {
      STAT,
      POKEMON_TYPE,
    });

  public crawling = async (): Promise<IPokemonSimpleInfo[]> => {
    let currentCount = 0;
    let pokemons: IPokemonSimpleInfo[] = [];

    const isLoop = currentCount < this.loopCount;
    const nextClickSelector = '.entity-nav-next';
    const navigationPromise = this.page.waitForNavigation();

    await this.initLocalStorage();
    do {
      await this.initCrawlingUtils();
      await this.page.waitForSelector('#main');

      const pokemon = await this.page.evaluate(this.getPokemons);

      const forms = await this.page.$$eval('.tabset-basics > .tabs-tab-list > .tabs-tab', (_, $el = Array.from(_)) =>
        $el.map($el => $el.textContent!).filter((f, i) => i && !/partner/gi.test(f)),
      );
      if (forms.length) {
        pokemon.differentForm = (
          await Promise.all(forms.map((_, i) => this.page.evaluate(this.getPokemons, i + 1)))
        ).map((differentForm, i) => ({ ...differentForm, form: forms[i] }));
      }

      pokemons = [...pokemons, pokemon];

      currentCount = +pokemon.no;
      Logger.log(whiteBright(this.getPrettyJson(pokemon)), 'Result');
      this.loading.update(currentCount);

      if (!isLoop) break;

      await this.page.waitForSelector(nextClickSelector);
      await this.page.click(nextClickSelector);
      await navigationPromise;
    } while (isLoop);

    return pokemons;
  };

  private getPokemons = (i = 0): IPokemonSimpleInfo => {
    const $element = document.querySelector('#main')!;

    const array = <T>($el: Iterable<T>): T[] => Array.from($el);
    const children = ($el: Element | null) => ($el ? Array.from($el.children) : []);
    const getText = ($el: Element | null): string => $el?.textContent?.trim() ?? '';
    const getTexts = ($el: NodeListOf<Element> | Element[]): string[] =>
      Array.from($el).reduce<string[]>((acc, $el, _, __, text = getText($el)) => (text ? [...acc, text] : acc), []);

    const $panel = $element.querySelectorAll('.tabset-basics > .tabs-panel-list > .tabs-panel')[i];
    const $grid = array($panel.querySelectorAll('.grid-col:not(:nth-child(3))'));
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

    const name = getText($element.querySelector('h1'));
    const image = $image.querySelector('img')!.src;

    const no = getText($no);
    const types = getTexts(children($types));
    const species = getText($species).replace(/é/g, 'e');
    const height = getText($height).replace(/\s(\w).*/g, '$1');
    const weight = getText($weight).replace(/\s(\w).*/g, '$1');
    const abilities = getTexts($abilities.querySelectorAll('span > a'));
    const hiddenAbility = getText($abilities.querySelector('small > a')) || null;

    const evYield = getText($evYield);
    const catchRate = +getText($catchRate);
    const friendship = +getText($friendship).replace(/\(.*/, '');
    const exp = +getText($exp);

    const eegGroups = getText($eegGroups).split(',');
    const gender = getText($gender).split(',');
    const [cycle, step] = getText($eggCycles)
      .replace(/(?:\(|,| steps\))/g, '')
      .split(' ');
    const eggCycles = { cycle, step };

    const statNames = Object.values(window.STAT);
    const stats = getTexts($stats.filter((_, i) => !(i % 4))).map((value, i) => ({
      name: statNames[i],
      value: +value,
    }));

    const typeDefenseNames = Object.values(window.POKEMON_TYPE);
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
      form: null,
      differentForm: [],
      moves: {} as IMoves,
    };
  };
}
