import { Page } from 'puppeteer';
import { IEvolutionChain, IEvolvingTo, IWindow } from '../pokemon.interface';
import {
  AdditionalCondition,
  Condition,
  DifferentForm,
  ElementalStone,
  EvolutionType,
  LevelCondition,
  TradingCondition,
  ExceptionalFormKey,
} from './type';

declare let window: IWindow;

export const getEvolutionChains = ($elements: Element[], type: string): IEvolutionChain[] => {
  return $elements.reduce<IEvolutionChain[]>((acc, $tr) => {
    const $cellNames = Array.from($tr.querySelectorAll('.cell-name'));
    const [from, to] = $cellNames.map(window.getPokemonInfo);
    const evolvingTo = window.getEvolvingTo($tr, to, type);
    const chain = { ...from, evolvingTo: [evolvingTo] };

    const fromEvolvingToIndex = acc.findIndex(p => p.evolvingTo.some(_p => _p.name === from.name));
    if (fromEvolvingToIndex > -1) return window.addFromEvolvingTo(acc, fromEvolvingToIndex, chain);

    const fromNameIndex = acc.findIndex(pokemon => pokemon.name === from.name);
    if (fromNameIndex > -1) {
      if (from.form) return window.addFromDifferentForm(acc, fromNameIndex, chain);
      return window.addMultipleEvolvingTo(acc, fromNameIndex, evolvingTo);
    }

    return [...acc, chain] as IEvolutionChain[];
  }, []);
};

export const initCrawlingUtils = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    window.getPokemonInfo = ($element: Element): IEvolutionChain => {
      const $image = $element.querySelector('.icon-pkmn')!;

      const name = $element.querySelector('.ent-name')!.textContent!;
      const image = $image.getAttribute('data-src') ?? ($image as HTMLImageElement).src;
      const form = $element.querySelector('.text-muted')?.textContent ?? null;

      return { name, image, form, differentForm: [], evolvingTo: [] };
    };

    window.getEvolvingTo = ($element: Element, to: IEvolutionChain, type: string): IEvolvingTo => ({
      ...to,
      type,
      level: $element.querySelector('.cell-num')?.textContent ?? null,
      condition: $element.querySelector('.cell-med-text')?.textContent || null,
    });

    window.addFromEvolvingTo = (acc: IEvolutionChain[], index: number, chain: IEvolutionChain): IEvolutionChain[] => {
      acc[index].evolvingTo = [chain] as IEvolvingTo[];
      return acc;
    };

    window.addMultipleEvolvingTo = (acc: IEvolutionChain[], index: number, to: IEvolvingTo): IEvolutionChain[] => {
      acc[index].evolvingTo = [...acc[index].evolvingTo, to];
      return acc;
    };

    window.addFromDifferentForm = (
      acc: IEvolutionChain[],
      index: number,
      chain: IEvolutionChain,
    ): IEvolutionChain[] => {
      acc[index].differentForm = [...acc[index].differentForm, chain] as IEvolutionChain[];
      return acc;
    };
  });
};

const hasText = (textCompare: string) => (regExp: string | RegExp) => new RegExp(regExp, 'i').test(textCompare);

const getRegexp = (key: string): RegExp => {
  switch (key) {
    case ExceptionalFormKey.MEGA_X:
      return /mega.*x$/;
    case ExceptionalFormKey.MEGA_Y:
      return /mega.*y$/;
    case ExceptionalFormKey.GALARIAN_STANDARD_MODE:
      return /galar.*standard mode/;
    case ExceptionalFormKey.GALARIAN_ZEN_MODE:
      return /galar.*zen mode/;
    case ExceptionalFormKey.ASH_GRENINJA:
      return /ash-greninja/;
    case ExceptionalFormKey.FIFTY_PERCENT:
      return /50% forme/;
    case ExceptionalFormKey.TEN_PERCENT:
      return /10% forme/;
    case ExceptionalFormKey.PA_U_STYLE:
      return /pa'u style/;
    case ExceptionalFormKey.POM_POM_STYLE:
      return /pom-pom style/;
    case ExceptionalFormKey.HUNGRY_MODE:
      return /hangry mode|hungry mode/;
    default:
      return new RegExp(key.replace(/_/, ''));
  }
};

export const convertForm = (form: string | null): string | null => {
  if (!form) return null;

  const hasForm = hasText(form);
  if (hasForm(/striped|male|female|own tempo rockruff/)) return null;

  const key = Object.keys(DifferentForm).find(key => hasForm(getRegexp(key)));
  return key ? DifferentForm[key as keyof typeof DifferentForm] : null;
};

const getCondition = (condition: string | null, ConditionEnum: Condition): string | null => {
  if (!condition) return null;

  const key = Object.keys(ConditionEnum).find(key => hasText(condition)(key.replace(/_/, '')));
  return key ? ConditionEnum[key as keyof typeof ConditionEnum] : null;
};

const getConditionEnum = (type: EvolutionType) => {
  switch (type) {
    case EvolutionType.LEVEL:
      return LevelCondition;
    case EvolutionType.STONE:
      return ElementalStone;
    default:
      return TradingCondition;
  }
};
