/* eslint-disable no-console */
import { IEvolution } from '@/pokemon/pokemon.interface';
import {
  Conditions,
  conditions,
  differentFormName,
  DifferentFormName,
  EvolutionType,
  functionString,
  FunctionString,
  PokemonName,
  pokemonName,
} from '@/pokemon/pokemon.type';
import { CrawlingUtil } from '@/utils';
import { Page } from 'puppeteer';

const { getName, getForm, getCondition } = functionString;
export class Evolution extends CrawlingUtil {
  protected promiseLocalStorage = this.initLocalStorage([
    { pokemonName },
    { differentFormName },
    { conditions },
    { functionString: { getName, getForm, getCondition } },
  ]);

  constructor(page: Page, readonly evolutionType: EvolutionType) {
    super(page);
  }

  public crawling = async (): Promise<IEvolution[]> => {
    await this.promiseLocalStorage;

    const evolutions = await this.page.evaluate(this.getEvolution, this.evolutionType);

    return evolutions;
  };

  private getEvolution = (evolutionType: EvolutionType): IEvolution[] => {
    const { of, addTwiceEvolution, addDifferentForm, addMoreThanTwoKindsEvolution } = new (class {
      private type: {
        pokemonName: typeof pokemonName;
        differentFormName: typeof differentFormName;
      };
      private functionString: FunctionString;
      private conditions: Conditions;
      private $element: Element | null;
      private $elements: Element[];

      constructor() {
        this.type = {
          pokemonName: this.getItem<typeof pokemonName>('pokemonName'),
          differentFormName: this.getItem<typeof differentFormName>('differentFormName'),
        };
        this.functionString = this.getItem<FunctionString>('functionString');
        this.conditions = this.getItem<Conditions>('conditions');
      }

      public of = ($element: Element | Element[] | NodeListOf<Element> | null): this => {
        if (!$element) this.$element = null;
        else if ($element instanceof Element) this.$element = $element;
        else this.$elements = Array.from($element);

        return this;
      };
      private getItem = <T>(key: string): T => JSON.parse(localStorage.getItem(key) ?? '{}');
      private parseFunction = (funcString: string) => {
        const funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gim;
        const match = funcReg.exec(funcString.replace(/\n/g, ' '));
        if (!match) return null;

        const [, func, ...funcs] = match;
        return new Function(...func.split(',').concat(funcs));
      };
      public isEmpty = (object: any) => {
        return Array.isArray(object) ? !object.length : object.constructor === Object && !Object.keys(object).length;
      };
      public getElement = (): Element | null => this.$element;
      public getElements = (): Element[] => this.$elements;
      public getText = (): string => (<Element | null>this.$element)?.textContent?.trim().replace(/é/gi, 'e') ?? '';
      public getTexts = (): string[] => {
        return this.$elements.reduce<string[]>((acc, $element) => {
          const text = $element.textContent?.trim().replace(/é/gi, 'e') ?? '';
          return text ? [...acc, text] : acc;
        }, []);
      };
      private getSrc = (): string => this.$element?.querySelector<HTMLSpanElement>('.icon-pkmn')?.dataset.src ?? '';
      private getTitle = (): string => {
        return this.$element?.querySelector('a')?.title ?? '';
      };
      public matchText(regExp: RegExp): string {
        return this.getText().match(regExp)?.[1] ?? '';
      }
      public replaceText = (searchValue: string | RegExp, replaceValue = ''): string => {
        return this.getText().replace(new RegExp(searchValue, 'gi'), replaceValue);
      };
      private getName = (text: string): PokemonName => {
        return this.parseFunction(this.functionString.getName)?.call(null, text, this.type.pokemonName);
      };
      private getForm = (): DifferentFormName => {
        const text = this.$element?.querySelector('small')?.textContent ?? null;
        return this.parseFunction(this.functionString.getForm)?.call(null, text, this.type.differentFormName);
      };
      public getCondition = (): string[] => {
        const texts = this.getTexts();
        const { additionalCondition, exceptionalCondition } = this.conditions;
        const key = (evolutionType === 'status' ? 'otherCondition' : `${evolutionType}Condition`) as keyof Conditions;
        const conditionType = this.conditions[key];

        const [c1, c2, ...c] = texts.flatMap(c => (texts.length < 2 ? c?.split(', ') ?? c : c));
        const isAdditionalConditions = c.length > 0;
        const additionalConditions = isAdditionalConditions ? `${c2}, ${c.join('')}` : c2;

        const conditions = [c1, additionalConditions].filter(c => c);
        const params = [conditions, { evolutionType, conditionType, additionalCondition, exceptionalCondition }];

        return this.parseFunction(this.functionString.getCondition)?.apply(null, params);
      };
      private getPokemon = ($element: Element) => {
        const { getSrc, getTitle, getForm, getName } = this.of($element);
        const [, no, name] = getTitle().match(/(\d+).(\w.*)/) ?? [];
        return { no, name: getName(name), image: getSrc(), form: getForm(), evolvingTo: [], differentForm: [] };
      };
      public getPokemons = (): IEvolution[] => {
        return this.getElements().map<IEvolution>($element => {
          const pokemon = this.getPokemon($element);
          console.log('pokemon', pokemon.no, pokemon.name);
          return pokemon;
        });
      };
      public hasExceptionalConditions = (): boolean => {
        return evolutionType === 'status' && this.getTexts().some(c => c && /^\d|^use|^trade/.test(c));
      };
      public addDifferentForm = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
        const { no, form } = evolution;

        const index = previousPokemons.findIndex(p => p.no === no && form);
        if (index === -1) return false;

        const previousPokemon = previousPokemons[index];
        previousPokemon.differentForm = [...previousPokemon.differentForm, evolution];

        return true;
      };
      public addTwiceEvolution = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
        const { no, evolvingTo } = evolution;
        const index = previousPokemons.findIndex(p => p.evolvingTo.some(to => to.no === no));
        if (index === -1) return false;

        const previousPokemon = previousPokemons[index];
        previousPokemon.evolvingTo = previousPokemon.evolvingTo.map(to => ({ ...to, evolvingTo }));

        return true;
      };
      public addMoreThanTwoKindsEvolution = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
        const { no, form, evolvingTo } = evolution;
        const index = previousPokemons.findIndex(e => e.no === no && e.form === form);

        if (index === -1) return false;

        const previousPokemon = previousPokemons[index];
        previousPokemon.evolvingTo = [...previousPokemon.evolvingTo, ...evolvingTo];

        return true;
      };
    })();

    const $trList = of(document.querySelectorAll('#evolution > tbody > tr')).getElements();
    return $trList.reduce<IEvolution[]>((acc, $tr) => {
      const [from, to] = of($tr.querySelectorAll('td:nth-child(-2n + 3)')).getPokemons();
      const { getCondition, hasExceptionalConditions } = of($tr.querySelectorAll('td:nth-child(n + 4)'));

      if (hasExceptionalConditions()) return acc;

      const [condition, additionalCondition] = getCondition();
      const evolvingTo = { ...to, type: evolutionType, condition, additionalCondition };
      const evolution: IEvolution = { ...from, evolvingTo: [evolvingTo] };

      if (addTwiceEvolution(acc, evolution)) return acc;
      if (addMoreThanTwoKindsEvolution(acc, evolution)) return acc;
      if (addDifferentForm(acc, evolution)) return acc;

      return [...acc, evolution];
    }, []);
  };
}
