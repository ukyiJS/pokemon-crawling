import { CrawlingUtil } from '@/pokemon/crawling/utils';
import { IEvolution, IEvolvingTo } from '@/pokemon/pokemon.interface';
import { DIFFERENT_FORM, EVOLUTION_TYPE, POKEMON, UtilString } from '@/pokemon/pokemon.type';
import { Page } from 'puppeteer';

export class Evolution extends CrawlingUtil {
  evolutionType: EVOLUTION_TYPE;

  constructor(page: Page, evolutionType: EVOLUTION_TYPE) {
    super(page);
    this.evolutionType = evolutionType;
    // this.initLoading();

    this.promiseLocalStorage = this.initLocalStorage([{ util: this.utilString() }]);
  }

  public crawling = async (): Promise<IEvolution[]> => {
    await this.promiseLocalStorage;

    const evolutions = await this.page.evaluate(this.getEvolution);

    return evolutions;
  };

  private getEvolution = (type: EVOLUTION_TYPE): IEvolution[] => {
    const array = <T>($el: Iterable<T>): T[] => Array.from($el);
    const getText = ($el: Element): string | null => $el?.textContent?.trim() || null;
    const getTexts = ($el: NodeListOf<Element> | Element[]): string[] =>
      array($el).reduce<string[]>((acc, $el) => {
        const text = getText($el);
        return text ? [...acc, text] : acc;
      }, []);

    const getItem = <T>(key: string): T => JSON.parse(localStorage.getItem(key) ?? '{}');
    const parseFunction = (str: string) => {
      const funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gim;
      const match = funcReg.exec(str.replace(/\n/g, ' '));
      if (!match) return null;

      const [, func, ...funcs] = match;
      return new Function(...[...func.split(','), ...funcs]);
    };

    const POKEMON = getItem<POKEMON>('POKEMON');
    const util = getItem<UtilString>('util');

    const getName = (name: string): POKEMON => parseFunction(util.getName)?.call(null, name, POKEMON);
    const getForm = (form: string | null): DIFFERENT_FORM =>
      parseFunction(util.getForm)?.call(null, form, DIFFERENT_FORM);

    const $trList = array(document.querySelectorAll('#evolution > tbody > tr'));

    return $trList.reduce<IEvolution[]>((acc, $tr, i) => {
      const $pokemon = array($tr.querySelectorAll('td:nth-child(-2n + 3)'));
      const $condition = array($tr.querySelectorAll('td:nth-child(n + 4)'));

      const [from, to] = $pokemon.map<IEvolution>($td => {
        const image = $td.querySelector('img')?.src ?? '';
        const [, no, name] = $td.querySelector('a')?.title.match(/(\d+).(\w.*)/) ?? [];
        const form = $td.querySelector('small')?.textContent ?? null;
        return { no, name: getName(name), image, form: getForm(form), evolvingTo: [] };
      });

      const [condition, additionalCondition = null] = getTexts($condition);

      const evolvingTo: IEvolvingTo[] = [{ ...to, type, condition, additionalCondition }];
      const pokemon = { ...from, evolvingTo };

      const isTwiceEvolution = acc[i - 1]?.evolvingTo?.some(to => to.no === from.no);
      if (isTwiceEvolution) {
        const previousPokemon = acc[i - 1];
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
