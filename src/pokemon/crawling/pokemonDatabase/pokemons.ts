import { CrawlingUtil } from '@/pokemon/crawling/utils';
import { IEggCycle, IGenderRatio, IPokemonsOfDatabase, IStats, ITypeDefense } from '@/pokemon/pokemon.interface';
import { POKEMON_TYPE, STAT, ABILITY, POKEMON } from '@/pokemon/pokemon.type';
import { Logger } from '@nestjs/common';
import { whiteBright } from 'chalk';
import { Page } from 'puppeteer';
import { ObjectLiteral } from 'typeorm';

type UtilString = {
  getName: string;
  getTypes: string;
  getAbility: string;
  getEvYield: string;
  getGroups: string;
  getGender: string;
  getEggCycles: string;
  getStats: string;
  getTypeDefenses: string;
};

export class PokemonsOfDatabase extends CrawlingUtil {
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

  private utilString = (): UtilString => {
    const getName = `${function(raw: string, pokemon: POKEMON): POKEMON {
      const _raw = raw.replace(/\s/g, '');
      const [, name] = Object.entries(pokemon).find(([key]) => new RegExp(key, 'gi').test(_raw)) ?? [];
      return name as POKEMON;
    }}`;

    const getTypes = `${function(raw: string[], pokemonType: POKEMON_TYPE): POKEMON_TYPE[] | null {
      return raw.map(_type => {
        const [, typeName] = Object.entries(pokemonType).find(([key]) => new RegExp(key, 'gi').test(_type)) ?? [];
        return typeName as POKEMON_TYPE;
      });
    }}`;

    const getAbility = `${function(raw: string, ability: ABILITY): ABILITY | null {
      if (!raw) return null;
      const _raw = raw.replace(/\s/g, '');
      const [, abilityName] =
        Object.entries(ability).find(([key]) => new RegExp(key.replace(/_/g, ''), 'gi').test(_raw)) ?? [];
      return abilityName as ABILITY;
    }}`;

    const getEvYield = `${function(raw: string, stat: STAT): string | null {
      const _raw = raw.replace(/—/g, '');
      if (!_raw) return null;

      return _raw.replace(/(\d+).(\w.*)/, (_, g1, g2) => {
        const [, statName] = Object.entries(stat).find(([key]) => new RegExp(key, 'gi').test(g2))!;
        return `${statName} ${g1}`;
      });
    }}`;

    const getGroups = `${function(raw: string): string[] {
      return raw.replace(/—/g, '') ? raw.split(',') : [];
    }}`;

    const getGender = `${function(raw: string): IGenderRatio[] {
      const match = raw.match(/(\d*.\d*)(?=%)/g);
      const genderless = [{ name: '무성', ratio: 100 }];
      if (!match) return genderless;

      const [male, female] = match;
      return [
        { name: '수컷', ratio: +male },
        { name: '암컷', ratio: +female },
      ];
    }}`;

    const getEggCycles = `${function(raw: string) {
      const [cycle, step] = raw.replace(/(?:\(|—|,| steps\))/g, '').split(' ');
      return { cycle: Number(cycle), step };
    }}`;

    const getStats = `${function(raw: string[], stat: STAT) {
      return raw
        .filter((_, i) => !(i % 4))
        .map((value, i) => ({
          name: Object.values(stat)[i],
          value: +value,
        }));
    }}`;

    const getTypeDefenses = `${function(raw: string[], pokemonType: POKEMON_TYPE) {
      return raw.map((typeDefense, i) => ({
        type: Object.values(pokemonType)[i],
        damage: +(typeDefense || '1').replace(/(½)|(¼)/g, (_, g1, g2) => (g1 && '0.5') || (g2 && '0.25')),
      }));
    }}`;

    return { getName, getTypes, getAbility, getEvYield, getGroups, getGender, getEggCycles, getStats, getTypeDefenses };
  };

  public crawling = async (): Promise<IPokemonsOfDatabase[]> => {
    let currentCount = 0;
    let pokemons: IPokemonsOfDatabase[] = [];

    const localStorages = [
      { gdpr: '0' },
      { POKEMON },
      { POKEMON_TYPE },
      { STAT },
      { ABILITY },
      { util: this.utilString() },
    ];
    const nextClickSelector = '.entity-nav-next';
    const navigationPromise = this.page.waitForNavigation();

    await this.initLocalStorage(localStorages);

    while (true) {
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

      if (currentCount >= this.loopCount) break;

      await this.page.waitForSelector(nextClickSelector);
      await this.page.click(nextClickSelector);
      await navigationPromise;
    }

    return pokemons;
  };

  private getPokemons = (i = 0): IPokemonsOfDatabase => {
    const $element = document.querySelector('#main')!;

    const getItem = <T>(key: string): T => JSON.parse(localStorage.getItem(key)!);
    const parseFunction = (str: string) => {
      const funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gim;
      const match = funcReg.exec(str.replace(/\n/g, ' '));
      if (!match) return null;

      const [, func, ...funcs] = match;
      return new Function(...[...func.split(','), ...funcs]);
    };
    const POKEMON = getItem<POKEMON>('POKEMON');
    const STAT = getItem<STAT>('STAT');
    const POKEMON_TYPE = getItem<POKEMON_TYPE>('POKEMON_TYPE');
    const ABILITY = getItem<ABILITY>('ABILITY');
    const util = getItem<UtilString>('util');

    const getName = (name: string): POKEMON => parseFunction(util.getName)?.call(null, name, POKEMON);
    const getTypes = (types: string[]): POKEMON_TYPE[] => parseFunction(util.getTypes)?.call(null, types, POKEMON_TYPE);
    const getAbility = (raw: string | null): string | null => parseFunction(util.getAbility)?.call(null, raw, ABILITY);
    const getEvYield = (evYield: string): string => parseFunction(util.getEvYield)?.call(null, evYield, STAT);
    const getGroups = (eegGroups: string): string[] => parseFunction(util.getGroups)?.call(null, eegGroups);
    const getGender = (gender: string): IGenderRatio[] => parseFunction(util.getGender)?.call(null, gender);
    const getEggCycles = (eggCycles: string): IEggCycle => parseFunction(util.getEggCycles)?.call(null, eggCycles);
    const getStats = (stats: string[]): IStats[] => parseFunction(util.getStats)?.call(null, stats, STAT);
    const getTypeDefenses = (typeDefenses: string[]): ITypeDefense[] =>
      parseFunction(util.getTypeDefenses)?.call(null, typeDefenses, POKEMON_TYPE);

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
      [_$image],
      [$no, _$types, $species, $height, $weight, _$abilities],
      [$evYield, $catchRate, $friendship, $exp],
      [$eegGroups, $gender, $eggCycles],
      $stats,
      $typeDefenses,
    ] = $columns;
    const $name = $element.querySelector('h1');
    const $image = _$image.querySelector('img');
    const $types = children(_$types);
    const $abilities = _$abilities.querySelectorAll('span > a');
    const $hiddenAbility = _$abilities.querySelector('small > a');

    const raw = {
      no: getText($no),
      name: getText($name),
      image: $image?.src ?? '',
      types: getTexts($types),
      species: getText($species),
      height: getText($height),
      weight: getText($weight),
      abilities: getTexts($abilities),
      hiddenAbility: getText($hiddenAbility) || null,
      evYield: getText($evYield),
      catchRate: getText($catchRate),
      friendship: getText($friendship),
      exp: getText($exp),
      eegGroups: getText($eegGroups),
      gender: getText($gender),
      eggCycles: getText($eggCycles),
      stats: getTexts($stats),
      typeDefenses: getTexts($typeDefenses),
    };

    return {
      ...raw,
      name: getName(raw.name),
      engName: raw.name,
      types: getTypes(raw.types),
      abilities: raw.abilities.map(getAbility),
      hiddenAbility: getAbility(raw.hiddenAbility),
      species: raw.species.replace(/é/g, 'e'),
      height: raw.height.match(/^(\d+.\d*.\w+)/)?.[1] ?? null,
      weight: raw.weight.match(/^(\d+.\d*.\w+)/)?.[1] ?? null,
      evYield: getEvYield(raw.evYield),
      catchRate: Number(raw.catchRate.replace(/—|\s.*/g, '')),
      friendship: Number(raw.friendship.replace(/—|\s.*/g, '')),
      exp: Number(raw.exp.replace(/—|\s.*/g, '')),
      eegGroups: getGroups(raw.eegGroups),
      gender: getGender(raw.gender),
      eggCycles: getEggCycles(raw.eggCycles),
      stats: getStats(raw.stats),
      typeDefenses: getTypeDefenses(raw.typeDefenses),
    } as IPokemonsOfDatabase;
  };
}
