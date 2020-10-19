import { LoadingBar, LoadingType, STDOUT } from '@/utils';
import { Logger } from '@nestjs/common';
import { blueBright, redBright, yellowBright } from 'chalk';
import { Page } from 'puppeteer';
import { ObjectLiteral } from 'typeorm';
import { IEvolvingTo, IGenderRatio, IPokemon, IStats, IWindow } from '../pokemon.interface';
import { ABILITY, EGG_GROUP, POKEMON, POKEMON_TYPE, STAT, UtilString } from '../pokemon.type';

declare let window: IWindow;
type Loading = { update: (curser: number) => void };

export class CrawlingUtil {
  loadingBar: LoadingBar;

  loadingSize: number;

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected getPrettyJson = <T>(json: T): string =>
    `${JSON.stringify(json)}`
      .replace(/("(?=n|e|i|t|s|c|a|h|f|w|g|r|d|v)(\w)+")/g, (_, m1) => m1.replace(/"/g, ''))
      .replace(/([:,{](?!\/))/g, '$1 ')
      .replace(/([}])/g, ' $1')
      .replace(/([[\]{}])/g, blueBright('$1'))
      .replace(/(\w+:(?!\/))/g, yellowBright('$1'))
      .replace(/(null)/g, redBright('$1'));

  protected initLoading = (size: number, type: LoadingType = STDOUT): void => {
    this.loadingSize = size;
    this.loadingBar = new LoadingBar(type);
  };

  protected get loading(): Loading {
    if (!this.loadingBar) throw redBright('loading has not been initialized.');
    return { update: (curser: number): void => this.loadingBar.update((curser / this.loadingSize) * 100) };
  }

  protected initLocalStorage = async (localStorageItems: ObjectLiteral[]): Promise<void> => {
    await this.page.evaluate<(items: ObjectLiteral[]) => void>(items => {
      items.forEach(item =>
        Object.entries(item).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value))),
      );
    }, localStorageItems);
    Logger.log('initLocalStorage', 'LocalStorage');
    await this.page.reload();
    Logger.log('page is reloaded', 'Reload');
  };

  protected utilString = (): UtilString => {
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
      const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
      const [, abilityName] = Object.entries(ability).find(([key]) => regExp(key).test(_raw)) ?? [];
      return abilityName as ABILITY;
    }}`;

    const getEvYield = `${function(raw: string, stat: STAT): string | null {
      const _raw = raw.replace(/—/g, '');
      if (!_raw) return null;

      return _raw.replace(/(\d+).(\w.*)/, (_, g1, g2) => {
        const [, statName] = Object.entries(stat).find(([key]) => new RegExp(key, 'gi').test(g2)) ?? [];
        return statName ? `${statName} ${g1}` : '';
      });
    }}`;

    const getEggGroups = `${function(raw: string, eggGroup: EGG_GROUP): EGG_GROUP[] {
      const _raw = raw.replace(/[^a-z0-9-,]/gi, '');
      if (!_raw) return [];

      const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
      return _raw.split(',').map(group => {
        const [key = '', groupName = ''] = Object.entries(eggGroup).find(([key]) => regExp(key).test(group)) ?? [];
        return group.replace(regExp(key), groupName) as EGG_GROUP;
      });
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

    return {
      getName,
      getTypes,
      getAbility,
      getEvYield,
      getEggGroups,
      getGender,
      getEggCycles,
      getStats,
      getTypeDefenses,
    };
  };
}

export const initCrawlingUtils = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    window.getText = ($element: Element): string => $element.textContent!;
    window.getTexts = ($elements: NodeListOf<Element> | Element[]): string[] =>
      $elements.length ? Array.from($elements).map(({ textContent }) => textContent!) : [];

    window.getPokemonInfo = ($element: Element): IPokemon => {
      const stats = (($totalStat = $element.querySelector('.cell-total')): IStats[] | undefined => {
        if (!$totalStat) return undefined;

        const statNames = ['HP', '공격', '방어', '특수공격', '특수방어', '스피드'];
        const $stats = $element.querySelectorAll('.cell-num:not(.cell-fixed)');
        const stats = window.getTexts($stats).map<IStats>((value, i) => ({ name: statNames[i], value: +value }));
        const totalStat = { name: '총합', value: +window.getText($totalStat) };

        return [...stats, totalStat];
      })();

      const types = (($types = $element.querySelectorAll('.cell-icon a')): string[] | undefined => {
        return $types.length ? window.getTexts($types) : undefined;
      })();

      const noText = $element.querySelector('.infocard-cell-data')?.textContent ?? undefined;
      const no = Number(noText) ? noText : undefined;
      const name = $element.querySelector('.ent-name')!.textContent!;
      const $image = $element.querySelector('.icon-pkmn')!;
      const image = $image.getAttribute('data-src') ?? ($image as HTMLImageElement).src;
      const form = $element.querySelector('.text-muted')?.textContent ?? null;

      return { no, name, image, form, types, stats, differentForm: [], evolvingTo: [] };
    };

    window.getEvolvingTo = ($element: Element, to: IPokemon, type: string): IEvolvingTo => ({
      ...to,
      type,
      level: $element.querySelector('.cell-num')?.textContent || null,
      condition: $element.querySelector('.cell-med-text')?.textContent || null,
    });

    window.addFromEvolvingTo = (acc: IPokemon[], index: number, chain: IPokemon): IPokemon[] => {
      acc[index].evolvingTo = [chain] as IEvolvingTo[];
      return acc;
    };

    window.addMultipleEvolvingTo = (acc: IPokemon[], index: number, to: IEvolvingTo): IPokemon[] => {
      acc[index].evolvingTo = [...acc[index].evolvingTo, to];
      return acc;
    };
    window.addFromDifferentForm = (acc: IPokemon[], index: number, chain: IPokemon): IPokemon[] => {
      acc[index].differentForm = [...acc[index].differentForm, chain];
      return acc;
    };

    window.getStats = ($element: Element): IStats[] => {
      const totalStat = { name: '총합', value: +$element.querySelector('.cell-total')!.textContent! };
      const statNames = ['HP', '공격', '방어', '특수공격', '특수방어', '스피드'];
      const stats = Array.from($element.querySelectorAll('.cell-num:not(.cell-fixed)')).map((stat, i) => ({
        name: statNames[i],
        value: +stat.textContent!,
      }));
      return [...stats, totalStat];
    };
  });
};
