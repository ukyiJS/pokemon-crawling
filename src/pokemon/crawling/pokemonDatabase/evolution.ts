import { CrawlingUtil } from '@/pokemon/crawling/utils';
import { IConditions, IEvolution, IEvolvingTo } from '@/pokemon/pokemon.interface';
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
    const util = getItem<UtilString>('util');

    const getConditionParams = (conditions: (string | null)[]) => {
      const condition = (() => {
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
      const [c1, c2, ...c] = conditions.flatMap(c => (conditions.length < 2 ? c?.split(', ') ?? c : c));
      const _conditions = [c1, c.length ? `${c2}, ${c.join('')}` : c2].filter(c => c);
      return [_conditions, type, condition, CONDITIONS.ADDITIONAL_CONDITION, CONDITIONS.EXCEPTIONAL_CONDITION];
    };

    const getName = (name: string): POKEMON => parseFunction(util.getName)?.call(null, name, POKEMON);
    const getForm = (form: string | null): DIFFERENT_FORM =>
      parseFunction(util.getForm)?.call(null, form, DIFFERENT_FORM);
    const getCondition = (conditions: (string | null)[]): string[] =>
      parseFunction(util.getCondition)?.apply(null, getConditionParams(conditions));

    const $trList = array(document.querySelectorAll('#evolution > tbody > tr'));

    return $trList.reduce<IEvolution[]>((acc, $tr) => {
      const $pokemon = array($tr.querySelectorAll('td:nth-child(-2n + 3)'));
      const $condition = array($tr.querySelectorAll('td:nth-child(n + 4)'));

      const [from, to] = $pokemon.map<IEvolution>($td => {
        const image = $td.querySelector<HTMLSpanElement>('.icon-pkmn')?.dataset.src ?? '';
        const [, no, name] = $td.querySelector('a')?.title.match(/(\d+).(\w.*)/) ?? [];
        const form = $td.querySelector('small')?.textContent ?? null;
        return { no, name: getName(name), image, form: getForm(form), evolvingTo: [] };
      });
      const conditions = getTexts($condition);
      if (type === 'status' && conditions.some(c => c && /^\d|^use|^trade/.test(c))) return acc;

      const [condition, additionalCondition] = getCondition(conditions);

      const evolvingTo: IEvolvingTo[] = [{ ...to, type, condition, additionalCondition }];
      const pokemon = { ...from, evolvingTo };

      const twiceEvolutionIndex = acc.findIndex(e => e.evolvingTo.some(to => to.no === from.no));
      if (twiceEvolutionIndex > -1) {
        const previousPokemon = acc[twiceEvolutionIndex];
        previousPokemon.evolvingTo = previousPokemon.evolvingTo.map(to => ({ ...to, evolvingTo }));
        return acc;
      }

      const moreThanTwoKindsEvolutionIndex = acc.findIndex(e => e.no === from.no && e.form === from.form);
      if (moreThanTwoKindsEvolutionIndex > -1) {
        const previousPokemon = acc[moreThanTwoKindsEvolutionIndex];
        previousPokemon.evolvingTo = previousPokemon.evolvingTo.concat(evolvingTo);
        return acc;
      }

      return [...acc, pokemon] as IEvolution[];
    }, []);
  };
}
