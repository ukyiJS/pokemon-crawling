import { CrawlingUtil } from '@/pokemon/crawling/utils';
import { IEggCycle, IGender, IPokemonsOfDatabase, IStats, ITypeDefense } from '@/pokemon/pokemon.interface';
import { ABILITY, EGG_GROUP, POKEMON, POKEMON_TYPE, STAT, UtilString } from '@/pokemon/pokemon.type';
import { Logger } from '@nestjs/common';
import { whiteBright } from 'chalk';
import { Page } from 'puppeteer';

export class PokemonsOfDatabase extends CrawlingUtil {
  private loopCount = 893;

  constructor(page: Page) {
    super(page);
    this.initLoading(this.loopCount);

    this.promiseLocalStorage = this.initLocalStorage([
      { gdpr: '0' },
      { POKEMON },
      { POKEMON_TYPE },
      { STAT },
      { ABILITY },
      { EGG_GROUP },
      { util: this.utilString() },
    ]);
  }

  public crawling = async (): Promise<IPokemonsOfDatabase[]> => {
    await this.promiseLocalStorage;

    let currentCount = 0;
    let pokemons: IPokemonsOfDatabase[] = [];
    const waitForNavigation = this.page.waitForNavigation();
    const nextClickSelector = '.entity-nav-next';

    while (true) {
      await this.page.waitForSelector('#main');
      await this.page.waitForSelector('.tabset-basics > .tabs-panel-list > .tabs-panel');

      const pokemon = await this.page.evaluate(this.getPokemons);
      pokemon.differentForm = await this.getDifferentForm();

      pokemons = [...pokemons, pokemon];

      currentCount = +pokemon.no;
      Logger.log(whiteBright(this.getPrettyJson(pokemon)), 'Result');
      this.loading.update(currentCount);

      if (currentCount >= this.loopCount) break;

      await this.page.waitForSelector(nextClickSelector);
      await this.page.click(nextClickSelector);
      await waitForNavigation;
    }

    return pokemons;
  };

  private getPokemons = (i = 0): IPokemonsOfDatabase => {
    const $element = document.querySelector('#main')!;

    const getItem = <T>(key: string): T => JSON.parse(localStorage.getItem(key) ?? '{}');
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
    const EGG_GROUP = getItem<EGG_GROUP>('EGG_GROUP');
    const util = getItem<UtilString>('util');

    const getName = (name: string): POKEMON => parseFunction(util.getName)?.call(null, name, POKEMON);
    const getTypes = (types: string[]): POKEMON_TYPE[] => parseFunction(util.getTypes)?.call(null, types, POKEMON_TYPE);
    const getAbility = (ability: string | null): string | null =>
      parseFunction(util.getAbility)?.call(null, ability, ABILITY);
    const getEvYield = (evYield: string): string => parseFunction(util.getEvYield)?.call(null, evYield, STAT);
    const getEggGroups = (eegGroups: string): EGG_GROUP[] =>
      parseFunction(util.getEggGroups)?.call(null, eegGroups, EGG_GROUP);
    const getGender = (gender: string): IGender[] => parseFunction(util.getGender)?.call(null, gender);
    const getEggCycles = (eggCycles: string): IEggCycle => parseFunction(util.getEggCycles)?.call(null, eggCycles);
    const getStats = (stats: string[]): IStats[] => parseFunction(util.getStats)?.call(null, stats, STAT);
    const getTypeDefenses = (typeDefenses: string[]): ITypeDefense[] =>
      parseFunction(util.getTypeDefenses)?.call(null, typeDefenses, POKEMON_TYPE);

    const array = <T>($el: Iterable<T>): T[] => Array.from($el);
    const children = ($el: Element | null) => ($el ? Array.from($el.children) : []);
    const getText = ($el: Element | null): string => $el?.textContent?.trim().replace(/é/gi, 'e') ?? '';
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
      typeDefenses: $typeDefenses.map(getText),
    };

    return {
      ...raw,
      name: getName(raw.name),
      engName: raw.name,
      types: getTypes(raw.types),
      abilities: raw.abilities.map(getAbility),
      hiddenAbility: getAbility(raw.hiddenAbility),
      height: raw.height.match(/(\w.*)(?=\s\()/)?.[1] ?? null,
      weight: raw.weight.match(/(\w.*)(?=\s\()/)?.[1] ?? null,
      evYield: getEvYield(raw.evYield),
      catchRate: Number(raw.catchRate.replace(/—|\s.*/g, '')),
      friendship: Number(raw.friendship.replace(/—|\s.*/g, '')),
      exp: Number(raw.exp.replace(/—|\s.*/g, '')),
      eegGroups: getEggGroups(raw.eegGroups),
      gender: getGender(raw.gender),
      eggCycles: getEggCycles(raw.eggCycles),
      stats: getStats(raw.stats),
      typeDefenses: getTypeDefenses(raw.typeDefenses),
    } as IPokemonsOfDatabase;
  };

  private getDifferentForm = async (): Promise<IPokemonsOfDatabase[]> => {
    let forms = await this.page.$$eval('.tabset-basics > .tabs-tab-list > .tabs-tab', $el => {
      return Array.from($el)
        .map($el => $el.textContent!)
        .filter((f, i) => i && !/partner/gi.test(f));
    });
    if (!forms.length) return [];

    forms = forms.map(this.getForm);

    const differentForms = await Promise.all(forms.map((_, i) => this.page.evaluate(this.getPokemons, i + 1)));
    return differentForms.map((differentForm, i) => ({ ...differentForm, form: forms[i] }));
  };
}
