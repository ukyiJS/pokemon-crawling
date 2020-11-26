/* eslint-disable no-console */
import { IEggCycle, IGender, IPokemonOfDatabase, IStat, ITypeDefense } from '@/pokemon/pokemon.interface';
import {
  abilityName,
  AbilityName,
  ConditionParam,
  ConditionType,
  differentFormName,
  DifferentFormName,
  eggGroupName,
  EggGroupName,
  PokemonName,
  pokemonName,
  PokemonTypeName,
  pokemonTypeName,
  statName,
} from '@/pokemon/pokemon.type';
import { Logger } from '@nestjs/common';
import { blueBright, redBright, yellowBright } from 'chalk';
import { Page } from 'puppeteer-extra/dist/puppeteer';
import { ObjectLiteral } from 'typeorm';

type Tuple<T, U> = readonly [T, U];
type Nullish<T> = T | null;

export abstract class CrawlingUtil {
  protected promiseLocalStorage: Promise<void>;

  constructor(readonly page: Page) {}

  public abstract crawling: () => Promise<ObjectLiteral[]>;

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
}

export const functionString = {
  getName: `${function(text: string, type: typeof pokemonName): PokemonName {
    const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
    if (isEmpty(type)) throw new Error('getName pokemonName Does Not Exist!');

    let name: PokemonName;
    try {
      const cleanText = text
        .replace(/(\w.*)(♂|♀)/g, (_, g1, g2) => `${g1}${g2 === '♂' ? 'm' : 'f'}`)
        .replace(/é/g, 'e')
        .replace(/[^a-z0-9]/gi, '');
      const regExp = (searchValue: string): RegExp => new RegExp(`^${searchValue.replace(/_/g, '')}$`, 'gi');
      [, name] = Object.entries(type).find(([key]) => regExp(key).test(cleanText))!;
    } catch (error) {
      console.error('No Matching Name Found', text);
      throw error;
    }
    return name;
  }}`,

  getTypes: `${function(texts: string[], type: typeof pokemonTypeName): PokemonTypeName[] | null {
    const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
    if (isEmpty(type)) throw new Error('getType pokemonTypeName Does Not Exist!');

    return texts.map(text => {
      let types: PokemonTypeName;
      try {
        [, types] = Object.entries(type).find(([key]) => new RegExp(key, 'gi').test(text))!;
      } catch (error) {
        console.error('No Matching Type Found', `${texts}`);
        throw error;
      }
      return types;
    });
  }}`,

  getAbility: `${function(text: string, type: typeof abilityName): AbilityName | null {
    const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
    if (isEmpty(type)) throw new Error('getAbility abilityName Does Not Exist!');

    if (!text) return null;

    let ability: AbilityName;
    try {
      const cleanText = text.replace(/[^a-z]/gi, '');
      const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
      [, ability] = Object.entries(type).find(([key]) => regExp(key).test(cleanText))!;
    } catch (error) {
      console.error('No Matching Ability Found', text);
      throw error;
    }
    return ability;
  }}`,

  getEvYield: `${function(text: string, type: typeof statName): string | null {
    const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
    if (isEmpty(type)) throw new Error('getEvYield statName Does Not Exist!');

    const cleanText = text.replace(/—/g, '');
    if (!cleanText) return null;

    return cleanText.replace(/(\d+).(\w.*)/, (_, g1, g2) => {
      let evYield: string;
      try {
        [, evYield] = Object.entries(type).find(([key]) => new RegExp(key, 'gi').test(g2))!;
      } catch (error) {
        console.error('No Matching EvYield Found', text);
        throw error;
      }
      return evYield ? `${evYield} ${g1}` : '';
    });
  }}`,

  getEggGroups: `${function(text: string, type: typeof eggGroupName): EggGroupName[] {
    const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
    if (isEmpty(type)) throw new Error('getEggGroups eggGroupName Does Not Exist!');

    const cleanText = text.replace(/[^a-z0-9-,]/gi, '');
    if (!cleanText) return [];

    return cleanText.split(',').map(text => {
      let key: RegExp;
      let value: EggGroupName;
      const regExp = (searchValue: string): RegExp => new RegExp(searchValue.replace(/_/g, ''), 'gi');
      try {
        const eggGroup = text.replace(/[^a-z]/gi, '');
        [key, value] = Object.entries(type)
          .map<Tuple<RegExp, EggGroupName>>(([key, value]) => [regExp(key), value])
          .find(([key]) => key.test(eggGroup))!;
      } catch (error) {
        console.error('No Matching EggGroups Found', text);
        throw error;
      }
      return <EggGroupName>value.replace(key, value);
    });
  }}`,

  getGender: `${function(text: string): IGender[] {
    const match = text.match(/(\d.*)(?=%).*(?<=,\s)(\d.*)(?=%)/);
    const genderless = [{ name: '무성', ratio: 100 }];
    if (!match) return genderless;

    const [, male, female] = match;
    return [
      { name: '수컷', ratio: +male },
      { name: '암컷', ratio: +female },
    ];
  }}`,

  getEggCycles: `${function(text: string): IEggCycle | null {
    const match = text.match(/(\d.*)(?:\s\()(\d.*)(?:\ssteps)/);
    if (!match) return null;

    const [, cycle, step] = match;
    return {
      cycle: +cycle,
      step: step.split('–').map(step => +step.replace(/\D/g, '')),
    };
  }}`,

  getStat: `${function(texts: string[], type: typeof statName): IStat[] {
    const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
    if (isEmpty(type)) throw new Error('getStat param statName Does Not Exist!');

    const statNames = Object.values(type);
    return texts.filter((_, i) => !(i % 4)).map((value, i) => ({ name: statNames[i], value: +value }));
  }}`,

  getTypeDefenses: `${function(texts: string[], type: typeof pokemonTypeName): ITypeDefense[] {
    const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
    if (isEmpty(type)) throw new Error('getTypeDefenses param pokemonTypeName Does Not Exist!');
    if (texts.length < 18) throw new Error('getTypeDefenses be short of type! Check typeDefenses param');

    const pokemonTypes = Object.values(type);
    const convertToDamage = (text: string) => +text.replace(/(½)|(¼)/g, (_, g1, g2) => (g1 && '0.5') || (g2 && '0.25'));
    return texts.map((text, i) => ({ type: pokemonTypes[i], damage: convertToDamage(text) }));
  }}`,

  getForm: `${function(text: string | null, type: typeof differentFormName): DifferentFormName | null {
    const isEmpty = (object: any) => object.constructor === Object && !Object.keys(object).length;
    if (isEmpty(type)) throw new Error('getForm param differentFormName Does Not Exist!');
    if (!text) return null;

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

    let form: DifferentFormName;
    try {
      [, form] = Object.entries(type).find(([key]) => {
        const regExp = new RegExp(convertKeyToRegExp(key), 'gi');
        const _form = text.replace(/[^a-z0-9]/gi, '');
        return regExp.test(_form);
      })!;
    } catch (error) {
      console.error('No Matching Form Found', text);
      throw error;
    }
    return form;
  }}`,

  getCondition: `${function(texts: Nullish<string>[], type: ConditionParam): Nullish<string>[] {
    const { getConditions } = new (class {
      constructor(
        readonly evolutionType = type.evolutionType,
        readonly additionalCondition = type.additionalCondition,
        readonly conditionType = type.conditionType,
        readonly exceptionalCondition = type.exceptionalCondition,
      ) {}
      public getConditions = () => {
        const filteredConditions = texts.filter(text => !this.hasExceptionalCondition(text));
        const [condition1, condition2] = this.convertToConditions(filteredConditions);

        const cleanText = (text: Nullish<string>): string => this.replaceText(text, /null\s/);
        const conditionTexts = {
          level: [`레벨 ${condition1}`, condition2],
          stone: [`${condition1} 사용`, condition2],
          trade: [cleanText(`${condition1} 통신교환`), condition2],
          friendship: [cleanText(`친밀도가 220이상일 때 ${condition1} 레벨업`), condition2],
          status: [condition1, condition2],
          none: [condition1, condition2],
        };
        return conditionTexts[this.evolutionType];
      };
      private convertRegExp = (text: string | RegExp): RegExp => new RegExp(text, 'gi');
      private replaceText = (text: Nullish<string>, searchValue: string | RegExp, replaceValue = '') => {
        return `${text}`.replace(this.convertRegExp(searchValue), replaceValue);
      };
      private hasExceptionalCondition = (text: Nullish<string>): boolean => {
        return this.exceptionalCondition.some(condition => text && this.convertRegExp(condition).test(text));
      };
      private findCondition = (text: Nullish<string>, conditionType: ConditionType): Nullish<string> => {
        if (!text) return null;

        let condition: string;
        try {
          const cleanText = this.replaceText(text, /\s/);
          [, condition] = Object.entries(conditionType).find(([key]) => {
            const regExp = this.replaceText(key, /_/);
            return this.convertRegExp(regExp).test(cleanText);
          })!;
        } catch (error) {
          console.error(`No Matching ${type.evolutionType} conditions Found`, `${texts}`);
          throw error;
        }
        return condition;
      };
      private levelConditions = (condition1: Nullish<string>, condition2: Nullish<string>) => {
        const splitConditions = condition2?.split(', ');
        const convertedCondition = splitConditions?.reduce((acc, c, i) => {
          return `${acc} ${this.findCondition(c, i ? this.additionalCondition : this.conditionType)}`;
        }, '');
        return [condition1, convertedCondition ?? null];
      };
      private convertToConditions = ([condition1, condition2]: Nullish<string>[]): Nullish<string>[] => {
        if (this.evolutionType === 'level') return this.levelConditions(condition1, condition2);
        return [
          this.findCondition(condition1, this.conditionType),
          this.findCondition(condition2, this.additionalCondition),
        ];
      };
    })();

    return getConditions();
  }}`,
} as const;
export type FunctionString = typeof functionString;

export const getGenerationName = (no: number): string => {
  if (no < 152) return 'gen1';
  if (no < 252) return 'gen2';
  if (no < 387) return 'gen3';
  if (no < 494) return 'gen4';
  if (no < 650) return 'gen5';
  if (no < 722) return 'gen6';
  if (no < 810) return 'gen7';
  return 'gen8';
};

const getImageUrl = (name: string): string => {
  return `https://raw.githubusercontent.com/ukyiJS/pokemon-crawling/image/${name}.png`;
};

export const setImage = (dirName: string, no: string): string => {
  const imageUrl = getImageUrl(`${dirName}/${no}`);
  return imageUrl;
};

export const setDifferentFormImage = (dirName: string, differentForm: IPokemonOfDatabase[]): IPokemonOfDatabase[] => {
  const convertToDifferentFormImage = differentForm.map(pokemon => {
    const [key] = Object.entries(differentFormName).find(([, value]) => {
      return RegExp(value, 'gi').test(pokemon.form ?? '');
    })!;
    const convertToImageName = key.toLowerCase().replace(/[^a-z]+(\w|$)/g, (_, $1) => {
      return $1.toUpperCase();
    });
    const imageUrl = getImageUrl(`${dirName}/${pokemon.no}-${convertToImageName}`);
    return { ...pokemon, image: imageUrl };
  });
  return convertToDifferentFormImage;
};
