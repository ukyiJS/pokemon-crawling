/* eslint-disable no-console */
import { ProgressBar, ProgressType } from '@/utils';
import { Logger } from '@nestjs/common';
import { blueBright, redBright, yellowBright } from 'chalk';
import { Page } from 'puppeteer';
import { ObjectLiteral } from 'typeorm';
import { IEggCycle, IEvolution, IGender, IStat, ITypeDefense } from '../pokemon.interface';
import {
  AbilityName,
  AdditionalCondition,
  ConditionType,
  differentFormName,
  DifferentFormName,
  EggGroupName,
  EvolutionType,
  ExceptionalCondition,
  exceptionalFormName,
  FuncString,
  pokemonName,
  PokemonName,
  pokemonTypeName,
  PokemonTypeName,
  StatName,
} from '../pokemon.type';

type Loading = { update: (curser: number) => void };

export class CrawlingUtil {
  protected progressBar: ProgressBar;

  protected progressBarSize: number;

  protected page: Page;

  protected promiseLocalStorage: Promise<void>;

  constructor(page?: Page) {
    if (page) this.page = page;
  }

  public getPrettyJson = <T>(json: T): string =>
    `${JSON.stringify(json)}`
      .replace(/("(?=n|e|i|t|s|c|a|h|f|w|g|r|d|v)(\w)+")/g, (_, m1) => m1.replace(/"/g, ''))
      .replace(/([:,{](?!\/))/g, '$1 ')
      .replace(/([}])/g, ' $1')
      .replace(/([[\]{}])/g, blueBright('$1'))
      .replace(/(\w+:(?!\/))/g, yellowBright('$1'))
      .replace(/(null)/g, redBright('$1'));

  public initLoading = (size: number, type?: ProgressType): void => {
    this.progressBarSize = size;
    this.progressBar = new ProgressBar(type);
  };

  public get loading(): Loading {
    if (!this.progressBar) throw redBright('loading has not been initialized.');
    return { update: (curser: number): void => this.progressBar.update((curser / this.progressBarSize) * 100) };
  }

  public initLocalStorage = async (localStorageItems: ObjectLiteral[]): Promise<void> => {
    await this.page.evaluate<(items: ObjectLiteral[]) => void>(items => {
      items.forEach(item =>
        Object.entries(item).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value))),
      );
    }, localStorageItems);
    Logger.log('Initialization LocalStorage', 'LocalStorage');
    await this.page.reload();
    Logger.log('Page is Reloaded', 'Reload');
  };

  public funcString = (): FuncString => {
    const getName = `${function(name: string, pokemonName: PokemonName): PokemonName {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(pokemonName)) throw new Error('getName pokemonName Does Not Exist!');

      let result: string;
      try {
        const _name = name
          .replace(/(\w.*)(♂|♀)/g, (_, g1, g2) => `${g1}${g2 === '♂' ? 'm' : 'f'}`)
          .replace(/[^a-z]/gi, '');
        const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
        [, result] = Object.entries(pokemonName).find(([key]) => regExp(key).test(_name))!;
      } catch (error) {
        console.error('No Matching Name Found', name);
        throw error;
      }
      return result as PokemonName;
    }}`;

    const getType = `${function(types: string[], pokemonTypeName: PokemonTypeName): PokemonTypeName[] | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(pokemonTypeName)) throw new Error('getType pokemonTypeName Does Not Exist!');

      return types.map(type => {
        let result: string;
        try {
          [, result] = Object.entries(pokemonTypeName).find(([key]) => new RegExp(key, 'gi').test(type))!;
        } catch (error) {
          console.error('No Matching Type Found', types);
          throw error;
        }
        return result as PokemonTypeName;
      });
    }}`;

    const getAbility = `${function(ability: string, abilityName: AbilityName): AbilityName | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(abilityName)) throw new Error('getAbility abilityName Does Not Exist!');

      if (!ability) return null;

      let result: string;
      try {
        const _ability = ability.replace(/[^a-z]/gi, '');
        const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
        [, result] = Object.entries(abilityName).find(([key]) => regExp(key).test(_ability))!;
      } catch (error) {
        console.error('No Matching Ability Found', ability);
        throw error;
      }
      return result as AbilityName;
    }}`;

    const getEvYield = `${function(evYield: string, statName: StatName): string | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(statName)) throw new Error('getEvYield statName Does Not Exist!');

      const _evYield = evYield.replace(/—/g, '');
      if (!_evYield) return null;

      return _evYield.replace(/(\d+).(\w.*)/, (_, g1, g2) => {
        let result: string;
        try {
          [, result] = Object.entries(statName).find(([key]) => new RegExp(key, 'gi').test(g2))!;
        } catch (error) {
          console.error('No Matching EvYield Found', evYield);
          throw error;
        }
        return result ? `${result} ${g1}` : '';
      });
    }}`;

    const getEggGroups = `${function(eggGroups: string, eggGroupName: EggGroupName): EggGroupName[] {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(eggGroupName)) throw new Error('getEggGroups eggGroupName Does Not Exist!');

      const _eggGroups = eggGroups.replace(/[^a-z0-9-,]/gi, '');
      if (!_eggGroups) return [];

      return _eggGroups.split(',').map(eggGroup => {
        let key: string;
        let value: string;
        const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
        try {
          const _eggGroup = eggGroup.replace(/[^a-z]/gi, '');
          [key, value] = Object.entries(eggGroupName).find(([key]) => regExp(key).test(_eggGroup))!;
        } catch (error) {
          console.error('No Matching EggGroups Found', eggGroups);
          throw error;
        }
        return value.replace(regExp(key), value) as EggGroupName;
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

    const getStat = `${function(stats: string[], statName: StatName): IStat[] {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(statName)) throw new Error('getStat param statName Does Not Exist!');

      return stats
        .filter((_, i) => !(i % 4))
        .map((value, i) => ({
          name: Object.values(statName)[i],
          value: +value,
        }));
    }}`;

    const getTypeDefenses = `${function(typeDefenses: string[], pokemonTypeName: PokemonTypeName): ITypeDefense[] {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(pokemonTypeName)) throw new Error('getTypeDefenses param pokemonTypeName Does Not Exist!');
      if (typeDefenses.length < 18) throw new Error('getTypeDefenses be short of type! Check typeDefenses param');

      return typeDefenses.map((typeDefense, i) => ({
        type: Object.values(pokemonTypeName)[i],
        damage: +typeDefense.replace(/(½)|(¼)/g, (_, g1, g2) => (g1 && '0.5') || (g2 && '0.25')),
      }));
    }}`;

    const getForm = `${function(form: string | null, differentFormName: DifferentFormName): DifferentFormName | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(differentFormName)) throw new Error('getForm param differentFormName Does Not Exist!');

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
        [, result] = Object.entries(differentFormName).find(([key]) => {
          const regExp = new RegExp(convertKeyToRegExp(key), 'gi');
          const _form = form.replace(/[^a-z0-9]/gi, '');
          return regExp.test(_form);
        })!;
      } catch (error) {
        console.error(`No Matching Form Found ${form}`, undefined, 'Error');
        throw error;
      }
      return result as DifferentFormName;
    }}`;

    const getCondition = `${function(
      conditions: (string | null)[],
      evolutionType: EvolutionType,
      conditionType: ConditionType,
      additionalCondition: AdditionalCondition,
      exceptionalCondition: ExceptionalCondition,
    ): (string | null)[] {
      const findCondition = (condition: string | null, conditionType: ConditionType): string | null => {
        if (!condition) return null;

        const blankRemovedCondition = condition.replace(/\s/g, '');
        const [, convertedCondition] = Object.entries(conditionType).find(([key]) => {
          return new RegExp(key.replace(/_/g, ''), 'gi').test(blankRemovedCondition);
        })!;
        return convertedCondition;
      };
      const cleanText = (condition: string | null) => `${condition}`.replace(/null\s/g, '');

      try {
        const hasExceptionalCondition = (condition: string | null): boolean =>
          exceptionalCondition.some(e => condition && new RegExp(e, 'gi').test(condition));
        const convertToConditions = ([condition1, condition2]: (string | null)[]): (string | null)[] => {
          if (evolutionType === 'level') {
            const convertedCondition = condition2
              ?.split(', ')
              .reduce((acc, c, i) => `${acc} ${findCondition(c, i ? additionalCondition : conditionType)}`, '');
            return [condition1, convertedCondition ?? null];
          }
          return [findCondition(condition1, conditionType), findCondition(condition2, additionalCondition)];
        };

        const filteredConditions = conditions.filter(c => !hasExceptionalCondition(c));
        const [convertedCondition1, convertedCondition2 = null] = convertToConditions(filteredConditions);
        switch (evolutionType) {
          case 'level':
            return [`레벨 ${convertedCondition1}`, convertedCondition2];
          case 'stone':
            return [`${convertedCondition1} 사용`, convertedCondition2];
          case 'trade':
            return [cleanText(`${convertedCondition1} 통신교환`), convertedCondition2];
          case 'friendship':
            return [cleanText(`친밀도가 220이상일 때 ${convertedCondition1} 레벨업`), convertedCondition2];
          default:
            return [convertedCondition1, convertedCondition2];
        }
      } catch (error) {
        console.error(`No Matching ${evolutionType} conditions Found ${conditions}`);
        throw error;
      }
    }}`;

    return {
      getName,
      getType,
      getAbility,
      getEvYield,
      getEggGroups,
      getGender,
      getEggCycles,
      getStat,
      getTypeDefenses,
      getForm,
      getCondition,
    };
  };

  public getForm = (form: string): DifferentFormName => {
    const convertKeyToRegExp = (key: string): RegExp => {
      switch (key) {
        case exceptionalFormName.MEGA_X:
          return /mega.*x$/;
        case exceptionalFormName.MEGA_Y:
          return /mega.*y$/;
        case exceptionalFormName.GALARIAN_STANDARD_MODE:
          return /galar.*standardmode/;
        case exceptionalFormName.GALARIAN_ZEN_MODE:
          return /galar.*zenmode/;
        case exceptionalFormName.FIFTY_PERCENT_FORM:
          return /50forme/;
        case exceptionalFormName.TEN_PERCENT_FORM:
          return /10forme/;
        case exceptionalFormName.HUNGRY_MODE:
          return /hangrymode|hungrymode/;
        default:
          return new RegExp(key.replace(/[^a-z]/gi, ''));
      }
    };
    let result: DifferentFormName;
    try {
      [, result] = Object.entries(differentFormName).find(([key]) => {
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

  public addTwiceEvolution = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
    const { no, differentForm, evolvingTo } = evolution;

    const hasEvolvingTo = <T extends IEvolution>(pokemon: T): boolean => {
      return pokemon.evolvingTo.some(pokemon => pokemon.no === no);
    };

    const differentFormIndex = previousPokemons.findIndex(p => p.differentForm.some(hasEvolvingTo));
    const evolutionIndex = previousPokemons.findIndex(hasEvolvingTo);
    const middleEvolutionIndex = previousPokemons.findIndex(p => evolvingTo.some(to => to.no === p.no));

    const index = [differentFormIndex, evolutionIndex, middleEvolutionIndex].find(i => i > -1) ?? -1;
    if (index === -1) return false;

    const previousPokemon = previousPokemons[index];

    if (differentFormIndex > -1) {
      const evolvingTo = differentForm.flatMap(d => d.evolvingTo);
      previousPokemon.differentForm = previousPokemon.differentForm.map(pokemon => ({
        ...pokemon,
        evolvingTo: previousPokemon.evolvingTo.map(to => ({ ...to, evolvingTo })),
      }));
    } else if (evolutionIndex > -1) {
      previousPokemon.evolvingTo = previousPokemon.evolvingTo.map(pokemon => ({ ...pokemon, ...evolution }));
    } else if (middleEvolutionIndex > -1) {
      const evolvingTo = evolution.evolvingTo.map(pokemon => ({ ...pokemon, ...previousPokemon }));
      previousPokemons[index] = { ...evolution, evolvingTo };
    }
    return true;
  };

  public addMoreThanTwoKindsEvolution = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
    const { no, evolvingTo } = evolution;

    const index = previousPokemons.findIndex(e => e.no === no);
    if (index === -1) return false;

    const previousPokemon = previousPokemons[index];
    previousPokemon.evolvingTo = [...previousPokemon.evolvingTo, ...evolvingTo];

    return true;
  };

  public addDifferentForm = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
    const { no, form } = evolution;
    if (!form) return false;

    const index = previousPokemons.findIndex(p => p.no === no);
    if (index === -1) return false;

    const previousPokemon = previousPokemons[index];
    previousPokemon.differentForm = [...previousPokemon.differentForm, evolution];

    return true;
  };
}

class Util {
  protected promiseLocalStorage: Promise<void>;

  constructor(readonly page: Page) {}

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

  protected getPrettyJson = <T>(json: T): string => {
    return `${JSON.stringify(json)}`
      .replace(/("(?=n|e|i|t|s|c|a|h|f|w|g|r|d|v)(\w)+")/g, (_, m1) => m1.replace(/"/g, ''))
      .replace(/([:,{](?!\/))/g, '$1 ')
      .replace(/([}])/g, ' $1')
      .replace(/([[\]{}])/g, blueBright('$1'))
      .replace(/(\w+:(?!\/))/g, yellowBright('$1'))
      .replace(/(null)/g, redBright('$1'));
  };

  protected funcString = (): FuncString => {
    const getName = `${function(name: string, pokemonName: PokemonName): PokemonName {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(pokemonName)) throw new Error('getName pokemonName Does Not Exist!');

      let result: string;
      try {
        const _name = name
          .replace(/(\w.*)(♂|♀)/g, (_, g1, g2) => `${g1}${g2 === '♂' ? 'm' : 'f'}`)
          .replace(/[^a-z]/gi, '');
        const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
        [, result] = Object.entries(pokemonName).find(([key]) => regExp(key).test(_name))!;
      } catch (error) {
        console.error('No Matching Name Found', name);
        throw error;
      }
      return result as PokemonName;
    }}`;

    const getType = `${function(types: string[], pokemonTypeName: PokemonTypeName): PokemonTypeName[] | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(pokemonTypeName)) throw new Error('getType pokemonTypeName Does Not Exist!');

      return types.map(type => {
        let result: string;
        try {
          [, result] = Object.entries(pokemonTypeName).find(([key]) => new RegExp(key, 'gi').test(type))!;
        } catch (error) {
          console.error('No Matching Type Found', `${types}`);
          throw error;
        }
        return result as PokemonTypeName;
      });
    }}`;

    const getAbility = `${function(ability: string, abilityName: AbilityName): AbilityName | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(abilityName)) throw new Error('getAbility abilityName Does Not Exist!');

      if (!ability) return null;

      let result: string;
      try {
        const _ability = ability.replace(/[^a-z]/gi, '');
        const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
        [, result] = Object.entries(abilityName).find(([key]) => regExp(key).test(_ability))!;
      } catch (error) {
        console.error('No Matching Ability Found', ability);
        throw error;
      }
      return result as AbilityName;
    }}`;

    const getEvYield = `${function(evYield: string, statName: StatName): string | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(statName)) throw new Error('getEvYield statName Does Not Exist!');

      const _evYield = evYield.replace(/—/g, '');
      if (!_evYield) return null;

      return _evYield.replace(/(\d+).(\w.*)/, (_, g1, g2) => {
        let result: string;
        try {
          [, result] = Object.entries(statName).find(([key]) => new RegExp(key, 'gi').test(g2))!;
        } catch (error) {
          console.error('No Matching EvYield Found', evYield);
          throw error;
        }
        return result ? `${result} ${g1}` : '';
      });
    }}`;

    const getEggGroups = `${function(eggGroups: string, eggGroupName: EggGroupName): EggGroupName[] {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(eggGroupName)) throw new Error('getEggGroups eggGroupName Does Not Exist!');

      const _eggGroups = eggGroups.replace(/[^a-z0-9-,]/gi, '');
      if (!_eggGroups) return [];

      return _eggGroups.split(',').map(eggGroup => {
        let key: string;
        let value: string;
        const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
        try {
          const _eggGroup = eggGroup.replace(/[^a-z]/gi, '');
          [key, value] = Object.entries(eggGroupName).find(([key]) => regExp(key).test(_eggGroup))!;
        } catch (error) {
          console.error('No Matching EggGroups Found', eggGroups);
          throw error;
        }
        return value.replace(regExp(key), value) as EggGroupName;
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

    const getStat = `${function(stats: string[], statName: StatName): IStat[] {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(statName)) throw new Error('getStat param statName Does Not Exist!');

      return stats
        .filter((_, i) => !(i % 4))
        .map((value, i) => ({
          name: Object.values(statName)[i],
          value: +value,
        }));
    }}`;

    const getTypeDefenses = `${function(typeDefenses: string[], pokemonTypeName: PokemonTypeName): ITypeDefense[] {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(pokemonTypeName)) throw new Error('getTypeDefenses param pokemonTypeName Does Not Exist!');
      if (typeDefenses.length < 18) throw new Error('getTypeDefenses be short of type! Check typeDefenses param');

      return typeDefenses.map((typeDefense, i) => ({
        type: Object.values(pokemonTypeName)[i],
        damage: +typeDefense.replace(/(½)|(¼)/g, (_, g1, g2) => (g1 && '0.5') || (g2 && '0.25')),
      }));
    }}`;

    const getForm = `${function(form: string | null, differentFormName: DifferentFormName): DifferentFormName | null {
      const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
      if (isEmpty(differentFormName)) throw new Error('getForm param differentFormName Does Not Exist!');

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
        [, result] = Object.entries(differentFormName).find(([key]) => {
          const regExp = new RegExp(convertKeyToRegExp(key), 'gi');
          const _form = form.replace(/[^a-z0-9]/gi, '');
          return regExp.test(_form);
        })!;
      } catch (error) {
        console.error(`No Matching Form Found ${form}`, undefined, 'Error');
        throw error;
      }
      return result as DifferentFormName;
    }}`;

    const getCondition = `${function(
      conditions: (string | null)[],
      evolutionType: EvolutionType,
      conditionType: ConditionType,
      additionalCondition: AdditionalCondition,
      exceptionalCondition: ExceptionalCondition,
    ): (string | null)[] {
      const findCondition = (condition: string | null, conditionType: ConditionType): string | null => {
        if (!condition) return null;

        const blankRemovedCondition = condition.replace(/\s/g, '');
        const [, convertedCondition] = Object.entries(conditionType).find(([key]) => {
          return new RegExp(key.replace(/_/g, ''), 'gi').test(blankRemovedCondition);
        })!;
        return convertedCondition;
      };
      const cleanText = (condition: string | null) => `${condition}`.replace(/null\s/g, '');

      try {
        const hasExceptionalCondition = (condition: string | null): boolean =>
          exceptionalCondition.some(e => condition && new RegExp(e, 'gi').test(condition));
        const convertToConditions = ([condition1, condition2]: (string | null)[]): (string | null)[] => {
          if (evolutionType === 'level') {
            const convertedCondition = condition2
              ?.split(', ')
              .reduce((acc, c, i) => `${acc} ${findCondition(c, i ? additionalCondition : conditionType)}`, '');
            return [condition1, convertedCondition ?? null];
          }
          return [findCondition(condition1, conditionType), findCondition(condition2, additionalCondition)];
        };

        const filteredConditions = conditions.filter(c => !hasExceptionalCondition(c));
        const [convertedCondition1, convertedCondition2 = null] = convertToConditions(filteredConditions);
        switch (evolutionType) {
          case 'level':
            return [`레벨 ${convertedCondition1}`, convertedCondition2];
          case 'stone':
            return [`${convertedCondition1} 사용`, convertedCondition2];
          case 'trade':
            return [cleanText(`${convertedCondition1} 통신교환`), convertedCondition2];
          case 'friendship':
            return [cleanText(`친밀도가 220이상일 때 ${convertedCondition1} 레벨업`), convertedCondition2];
          default:
            return [convertedCondition1, convertedCondition2];
        }
      } catch (error) {
        console.error(`No Matching ${evolutionType} conditions Found ${conditions}`);
        throw error;
      }
    }}`;

    return {
      getName,
      getType,
      getAbility,
      getEvYield,
      getEggGroups,
      getGender,
      getEggCycles,
      getStat,
      getTypeDefenses,
      getForm,
      getCondition,
    };
  };
}

export abstract class SerebiiNetUtil extends Util {
  constructor(page: Page) {
    super(page);

    const { getName, getType } = this.funcString();
    this.promiseLocalStorage = this.initLocalStorage([
      { funcString: { getName, getType } },
      { pokemonName },
      { pokemonTypeName },
    ]);
  }

  abstract crawling: () => Promise<ObjectLiteral[]>;
}
