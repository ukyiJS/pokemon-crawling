import { CrawlingUtil } from '@/pokemon/crawling/utils';
import { IConditions, IEvolution } from '@/pokemon/pokemon.interface';
import {
  ADDITIONAL_CONDITION,
  DIFFERENT_FORM,
  ELEMENTAL_STONE_CONDITION,
  EVOLUTION_TYPE,
  EXCEPTIONAL_CONDITION,
  FRIENDSHIP_CONDITION,
  LEVEL_CONDITION,
  OTHER_CONDITION,
  POKEMON,
  TRADING_CONDITION,
  UtilString,
} from '@/pokemon/pokemon.type';
import { Page } from 'puppeteer';

export class Evolution extends CrawlingUtil {
  evolutionType: EVOLUTION_TYPE;

  constructor(page: Page, evolutionType: EVOLUTION_TYPE) {
    super(page);
    this.evolutionType = evolutionType;

    this.promiseLocalStorage = this.initLocalStorage([
      { POKEMON },
      { DIFFERENT_FORM },
      {
        CONDITIONS: {
          ADDITIONAL_CONDITION,
          EXCEPTIONAL_CONDITION,
          LEVEL_CONDITION,
          ELEMENTAL_STONE_CONDITION,
          FRIENDSHIP_CONDITION,
          TRADING_CONDITION,
          OTHER_CONDITION,
        },
      },
      { util: this.utilString() },
    ]);
  }

  public crawling = async (): Promise<IEvolution[]> => {
    await this.promiseLocalStorage;

    const evolutions = await this.page.evaluate(this.getEvolution, this.evolutionType);

    return evolutions;
  };

  private getEvolution = (type: EVOLUTION_TYPE): IEvolution[] => {
    const array = <T>($el: Iterable<T>): T[] => Array.from($el);
    const getText = ($el: Element): string | null => $el?.textContent?.trim().replace(/é/gi, 'e') || null;
    const getTexts = ($el: NodeListOf<Element> | Element[]): (string | null)[] => array($el).map(getText);

    const getItem = <T>(key: string): T => JSON.parse(localStorage.getItem(key) ?? '{}');
    const parseFunction = (str: string) => {
      const funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gim;
      const match = funcReg.exec(str.replace(/\n/g, ' '));
      if (!match) return null;

      const [, func, ...funcs] = match;
      return new Function(...[...func.split(','), ...funcs]);
    };

    const POKEMON = getItem<POKEMON>('POKEMON');
    const DIFFERENT_FORM = getItem<DIFFERENT_FORM>('DIFFERENT_FORM');
    const CONDITIONS = getItem<IConditions>('CONDITIONS');
    const CONDITION = (() => {
      switch (type) {
        case 'level':
          return CONDITIONS.LEVEL_CONDITION;
        case 'stone':
          return CONDITIONS.ELEMENTAL_STONE_CONDITION;
        case 'trade':
          return CONDITIONS.TRADING_CONDITION;
        case 'friendship':
          return CONDITIONS.FRIENDSHIP_CONDITION;
        default:
          return CONDITIONS.OTHER_CONDITION;
      }
    })();
    const util = getItem<UtilString>('util');

    const getName = (name: string): POKEMON => parseFunction(util.getName)?.call(null, name, POKEMON);
    const getForm = (form: string | null): DIFFERENT_FORM =>
      parseFunction(util.getForm)?.call(null, form, DIFFERENT_FORM);
    const getCondition = (conditions: (string | null)[]): string[] => {
      const [c1, c2, ...c] = conditions.flatMap(c => (conditions.length < 2 ? c?.split(', ') ?? c : c));
      const isAdditionalConditions = c.length > 0;
      const additionalConditions = isAdditionalConditions ? `${c2}, ${c.join('')}` : c2;

      const _conditions = [c1, additionalConditions].filter(c => c);
      const params = [_conditions, type, CONDITION, CONDITIONS.ADDITIONAL_CONDITION, CONDITIONS.EXCEPTIONAL_CONDITION];

      return parseFunction(util.getCondition)?.apply(null, params);
    };

    const getPokemonInfo = ($pokemon: Element[]): IEvolution[] => {
      return $pokemon.map<IEvolution>($td => {
        const image = $td.querySelector<HTMLSpanElement>('.icon-pkmn')?.dataset.src ?? '';
        const [, no, name] = $td.querySelector('a')?.title.match(/(\d+).(\w.*)/) ?? [];
        const form = $td.querySelector('small')?.textContent ?? null;
        return { no, name: getName(name), image, form: getForm(form), evolvingTo: [], differentForm: [] };
      });
    };
    const hasExceptionalConditions = (conditions: (string | null)[]): boolean => {
      return type === 'status' && conditions.some(c => c && /^\d|^use|^trade/.test(c));
    };
    const addDifferentForm = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
      const { no, form } = evolution;

      const index = previousPokemons.findIndex(p => p.no === no && form);
      if (index === -1) return false;

      const previousPokemon = previousPokemons[index];
      previousPokemon.differentForm = [...previousPokemon.differentForm, evolution];

      return true;
    };
    const addTwiceEvolution = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
      const { no, evolvingTo } = evolution;
      const index = previousPokemons.findIndex(p => p.evolvingTo.some(to => to.no === no));
      if (index === -1) return false;

      const previousPokemon = previousPokemons[index];
      previousPokemon.evolvingTo = previousPokemon.evolvingTo.map(to => ({ ...to, evolvingTo }));

      return true;
    };
    const addMoreThanTwoKindsEvolution = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
      const { no, form, evolvingTo } = evolution;
      const index = previousPokemons.findIndex(e => e.no === no && e.form === form);

      if (index === -1) return false;

      const previousPokemon = previousPokemons[index];
      previousPokemon.evolvingTo = [...previousPokemon.evolvingTo, ...evolvingTo];

      return true;
    };

    const $trList = array(document.querySelectorAll('#evolution > tbody > tr'));
    return $trList.reduce<IEvolution[]>((acc, $tr) => {
      const $pokemon = array($tr.querySelectorAll('td:nth-child(-2n + 3)'));
      const $condition = array($tr.querySelectorAll('td:nth-child(n + 4)'));

      const [from, to] = getPokemonInfo($pokemon);
      const conditions = getTexts($condition);
      if (hasExceptionalConditions(conditions)) return acc;

      const [condition, additionalCondition] = getCondition(conditions);
      const evolvingTo = { ...to, type, condition, additionalCondition };
      const evolution: IEvolution = { ...from, evolvingTo: [evolvingTo] };

      if (addTwiceEvolution(acc, evolution)) return acc;
      if (addMoreThanTwoKindsEvolution(acc, evolution)) return acc;
      if (addDifferentForm(acc, evolution)) return acc;

      return [...acc, evolution];
    }, []);
  };
}
