import { CrawlingUtil } from '@/pokemon/crawling/utils';
import { IConditions, IEvolution } from '@/pokemon/pokemon.interface';
import {
  additionalCondition,
  differentFormName,
  DifferentFormName,
  elementalStoneCondition,
  EvolutionType,
  exceptionalCondition,
  friendshipCondition,
  levelCondition,
  otherCondition,
  PokemonName,
  pokemonName,
  tradingCondition,
  FuncString,
} from '@/pokemon/pokemon.type';
import { Page } from 'puppeteer';

export class Evolution extends CrawlingUtil {
  public evolutionType: EvolutionType;

  constructor(page: Page, evolutionType: EvolutionType) {
    super(page);
    this.evolutionType = evolutionType;

    this.promiseLocalStorage = this.initLocalStorage([
      { pokemonName },
      { differentFormName },
      {
        condition: {
          additionalCondition,
          exceptionalCondition,
          levelCondition,
          elementalStoneCondition,
          friendshipCondition,
          tradingCondition,
          otherCondition,
        },
      },
      { funcString: this.funcString() },
    ]);
  }

  public crawling = async (): Promise<IEvolution[]> => {
    await this.promiseLocalStorage;

    const evolutions = await this.page.evaluate(this.getEvolution, this.evolutionType);

    return evolutions;
  };

  private getEvolution = (type: EvolutionType): IEvolution[] => {
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

    const pokemonName = getItem<PokemonName>('pokemonName');
    const differentFormName = getItem<DifferentFormName>('differentFormName');
    const conditionType = getItem<IConditions>('condition');
    const condition = (() => {
      switch (type) {
        case 'level':
          return conditionType.levelCondition;
        case 'stone':
          return conditionType.elementalStoneCondition;
        case 'trade':
          return conditionType.tradingCondition;
        case 'friendship':
          return conditionType.friendshipCondition;
        default:
          return conditionType.otherCondition;
      }
    })();
    const funcString = getItem<FuncString>('funcString');

    const getName = (name: string): PokemonName => parseFunction(funcString.getName)?.call(null, name, pokemonName);
    const getForm = (form: string | null): DifferentFormName => {
      return parseFunction(funcString.getForm)?.call(null, form, differentFormName);
    };
    const getCondition = (conditions: (string | null)[]): string[] => {
      const [c1, c2, ...c] = conditions.flatMap(c => (conditions.length < 2 ? c?.split(', ') ?? c : c));
      const isAdditionalConditions = c.length > 0;
      const additionalConditions = isAdditionalConditions ? `${c2}, ${c.join('')}` : c2;

      const _conditions = [c1, additionalConditions].filter(c => c);
      const params = [
        _conditions,
        type,
        condition,
        conditionType.additionalCondition,
        conditionType.exceptionalCondition,
      ];

      return parseFunction(funcString.getCondition)?.apply(null, params);
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
