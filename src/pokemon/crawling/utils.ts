/* eslint-disable no-console */
import { LoadingBar, LoadingType, STDOUT } from '@/utils';
import { Logger } from '@nestjs/common';
import { blueBright, redBright, yellowBright } from 'chalk';
import { Page } from 'puppeteer';
import { ObjectLiteral } from 'typeorm';
import { IEggCycle, IGender, IStats, ITypeDefense } from '../pokemon.interface';
import {
  ABILITY,
  ADDITIONAL_CONDITION,
  CONDITIONS,
  DIFFERENT_FORM,
  EGG_GROUP,
  EVOLUTION_TYPE,
  EXCEPTIONAL_CONDITION,
  EXCEPTIONAL_FORM_KEY,
  POKEMON,
  POKEMON_TYPE,
  STAT,
  UtilString,
} from '../pokemon.type';

type Loading = { update: (curser: number) => void };

export class CrawlingUtil {
  protected loadingBar: LoadingBar;

  protected loadingSize: number;

  protected page: Page;

  protected promiseLocalStorage: Promise<void>;

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
    Logger.log('Initialization LocalStorage', 'LocalStorage');
    await this.page.reload();
    Logger.log('Page is Reloaded', 'Reload');
  };

  protected utilString = (): UtilString => {
    const getName = `${function(name: string, POKEMON: POKEMON): POKEMON {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(POKEMON)) throw new Error('getName POKEMON Does Not Exist!');

      let result: string;
      try {
        const _name = name
          .replace(/(\w.*)(♂|♀)/g, (_, g1, g2) => `${g1}${g2 === '♂' ? 'm' : 'f'}`)
          .replace(/[^a-z]/gi, '');
        const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
        [, result] = Object.entries(POKEMON).find(([key]) => regExp(key).test(_name))!;
      } catch (error) {
        console.error('No Matching Name Found', name);
        throw error;
      }
      return result as POKEMON;
    }}`;

    const getTypes = `${function(types: string[], POKEMON_TYPE: POKEMON_TYPE): POKEMON_TYPE[] | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(POKEMON_TYPE)) throw new Error('getTypes POKEMON_TYPE Does Not Exist!');

      return types.map(type => {
        let result: string;
        try {
          [, result] = Object.entries(POKEMON_TYPE).find(([key]) => new RegExp(key, 'gi').test(type))!;
        } catch (error) {
          console.error('No Matching Type Found', types);
          throw error;
        }
        return result as POKEMON_TYPE;
      });
    }}`;

    const getAbility = `${function(ability: string, ABILITY: ABILITY): ABILITY | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(ABILITY)) throw new Error('getAbility ABILITY Does Not Exist!');

      if (!ability) return null;

      let result: string;
      try {
        const _ability = ability.replace(/[^a-z]/gi, '');
        const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
        [, result] = Object.entries(ABILITY).find(([key]) => regExp(key).test(_ability))!;
      } catch (error) {
        console.error('No Matching Ability Found', ability);
        throw error;
      }
      return result as ABILITY;
    }}`;

    const getEvYield = `${function(evYield: string, STAT: STAT): string | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(STAT)) throw new Error('getEvYield STAT Does Not Exist!');

      const _evYield = evYield.replace(/—/g, '');
      if (!_evYield) return null;

      return _evYield.replace(/(\d+).(\w.*)/, (_, g1, g2) => {
        let result: string;
        try {
          [, result] = Object.entries(STAT).find(([key]) => new RegExp(key, 'gi').test(g2))!;
        } catch (error) {
          console.error('No Matching EvYield Found', evYield);
          throw error;
        }
        return result ? `${result} ${g1}` : '';
      });
    }}`;

    const getEggGroups = `${function(eggGroups: string, EGG_GROUP: EGG_GROUP): EGG_GROUP[] {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(EGG_GROUP)) throw new Error('getEggGroups EGG_GROUP Does Not Exist!');

      const _eggGroups = eggGroups.replace(/[^a-z0-9-,]/gi, '');
      if (!_eggGroups) return [];

      return _eggGroups.split(',').map(eggGroup => {
        let key: string;
        let value: string;
        const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
        try {
          const _eggGroup = eggGroup.replace(/[^a-z]/gi, '');
          [key, value] = Object.entries(EGG_GROUP).find(([key]) => regExp(key).test(_eggGroup))!;
        } catch (error) {
          console.error('No Matching EggGroup Found', eggGroups);
          throw error;
        }
        return value.replace(regExp(key), value) as EGG_GROUP;
      });
    }}`;

    const getGender = `${function(gender: string): IGender[] {
      const match = gender.match(/(\d.*)(?=%).*(?<=,\s)(\d.*)(?=%)/);
      const genderless = [{ name: '무성', ratio: 100 }];
      if (!match) return genderless;

      const [, male, female] = match;
      return [
        { name: '수컷', ratio: +male },
        { name: '암컷', ratio: +female },
      ];
    }}`;

    const getEggCycles = `${function(eggCycle: string): IEggCycle | null {
      const match = eggCycle.match(/(\d.*)(?:\s\()(\d.*)(?:\ssteps)/);
      if (!match) return null;

      const [, cycle, step] = match;
      return { cycle: +cycle, step };
    }}`;

    const getStats = `${function(stats: string[], STAT: STAT): IStats[] {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(STAT)) throw new Error('getStats param STAT Does Not Exist!');

      return stats
        .filter((_, i) => !(i % 4))
        .map((value, i) => ({
          name: Object.values(STAT)[i],
          value: +value,
        }));
    }}`;

    const getTypeDefenses = `${function(typeDefenses: string[], POKEMON_TYPE: POKEMON_TYPE): ITypeDefense[] {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(POKEMON_TYPE)) throw new Error('getTypeDefenses param POKEMON_TYPE Does Not Exist!');

      return typeDefenses.map((typeDefense, i) => ({
        type: Object.values(POKEMON_TYPE)[i],
        damage: +(typeDefense || '1').replace(/(½)|(¼)/g, (_, g1, g2) => (g1 && '0.5') || (g2 && '0.25')),
      }));
    }}`;

    const getForm = `${function(form: string | null, DIFFERENT_FORM: DIFFERENT_FORM): DIFFERENT_FORM | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(DIFFERENT_FORM)) throw new Error('getForm param DIFFERENT_FORM Does Not Exist!');

      if (!form) return null;

      const convertKeyToRegExp = (key: string): RegExp => {
        switch (key) {
          case 'MEGA_X':
            return /mega.*x$/;
          case 'MEGA_Y':
            return /mega.*y$/;
          case 'GALARIAN_STANDARD_MODE':
            return /galar.*standardmode/;
          case 'GALARIAN_ZEN_MODE':
            return /galar.*zenmode/;
          case 'FIFTY_PERCENT_FORM':
            return /50forme/;
          case 'TEN_PERCENT_FORM':
            return /10forme/;
          case 'HUNGRY_MODE':
            return /hangrymode|hungrymode/;
          default:
            return new RegExp(key.replace(/[^a-z]/gi, ''));
        }
      };
      let result: string;
      try {
        [, result] = Object.entries(DIFFERENT_FORM).find(([key]) => {
          const regExp = new RegExp(convertKeyToRegExp(key), 'gi');
          const _form = form.replace(/[^a-z0-9]/gi, '');
          return regExp.test(_form);
        })!;
      } catch (error) {
        console.error(`No Matching Form Found ${form}`, undefined, 'Error');
        throw error;
      }
      return result as DIFFERENT_FORM;
    }}`;

    const getCondition = `${function(
      conditions: (string | null)[],
      EVOLUTION_TYPE: EVOLUTION_TYPE,
      CONDITIONS: CONDITIONS,
      ADDITIONAL_CONDITION: ADDITIONAL_CONDITION,
      EXCEPTIONAL_CONDITION: EXCEPTIONAL_CONDITION,
    ): (string | null)[] {
      const findCondition = (condition: string | null, conditionType: CONDITIONS): string | null => {
        if (!condition) return null;

        const _condition = condition.replace(/\s/g, '');
        const [, result] = Object.entries(conditionType).find(([key]) => {
          const _key = key.replace(/_/g, '');
          return new RegExp(_key, 'gi').test(_condition);
        })!;
        return result;
      };

      const [condition1, condition2] = conditions.filter(c => {
        return !EXCEPTIONAL_CONDITION.some(e => c && new RegExp(e, 'gi').test(c));
      });
      const [convertedCondition1, convertedCondition2 = null] =
        EVOLUTION_TYPE === 'level'
          ? [
              condition1,
              condition2
                ?.split(', ')
                .reduce((acc, c, i) => `${acc} ${findCondition(c, i ? ADDITIONAL_CONDITION : CONDITIONS)}`, ''),
            ]
          : [findCondition(condition1, CONDITIONS), findCondition(condition2, ADDITIONAL_CONDITION)];

      try {
        switch (EVOLUTION_TYPE) {
          case 'level':
            return [condition1 ? `레벨 ${condition1}` : null, convertedCondition2];
          case 'stone':
            return [`${convertedCondition1} 사용`, convertedCondition2];
          case 'trade':
            return [`${convertedCondition1 ?? ''} 통신교환`.trim(), convertedCondition2];
          case 'friendship':
            return [`친밀도가 220이상일 때 ${convertedCondition1} 레벨업`, convertedCondition2];
          default:
            return [convertedCondition1, convertedCondition2];
        }
      } catch (error) {
        console.error(`No Matching ${EVOLUTION_TYPE} conditions Found ${conditions}`);
        throw error;
      }
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
      getForm,
      getCondition,
    };
  };

  protected getForm = (form: string): DIFFERENT_FORM => {
    const convertKeyToRegExp = (key: string): RegExp => {
      switch (key) {
        case EXCEPTIONAL_FORM_KEY.MEGA_X:
          return /mega.*x$/;
        case EXCEPTIONAL_FORM_KEY.MEGA_Y:
          return /mega.*y$/;
        case EXCEPTIONAL_FORM_KEY.GALARIAN_STANDARD_MODE:
          return /galar.*standardmode/;
        case EXCEPTIONAL_FORM_KEY.GALARIAN_ZEN_MODE:
          return /galar.*zenmode/;
        case EXCEPTIONAL_FORM_KEY.FIFTY_PERCENT_FORM:
          return /50forme/;
        case EXCEPTIONAL_FORM_KEY.TEN_PERCENT_FORM:
          return /10forme/;
        case EXCEPTIONAL_FORM_KEY.HUNGRY_MODE:
          return /hangrymode|hungrymode/;
        default:
          return new RegExp(key.replace(/[^a-z]/gi, ''));
      }
    };
    let result: DIFFERENT_FORM;
    try {
      [, result] = Object.entries(DIFFERENT_FORM).find(([key]) => {
        const regExp = new RegExp(convertKeyToRegExp(key), 'gi');
        const _form = form.replace(/[^a-z0-9]/gi, '');
        return regExp.test(_form);
      })!;
    } catch (error) {
      Logger.error(`No Matching Form Found ${form}`, undefined, 'Error');
      throw error;
    }
    return result;
  };
}
