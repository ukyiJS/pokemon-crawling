import { CrawlingUtil } from '@/pokemon/crawling/utils';
import { IEggCycle, IGender, IPokemonOfDatabase, IStat, ITypeDefense } from '@/pokemon/pokemon.interface';
import {
  AbilityName,
  abilityName,
  EggGroupName,
  eggGroupName,
  ExceptionalAbilityName,
  exceptionalAbilityName,
  PokemonName,
  pokemonName,
  PokemonTypeName,
  pokemonTypeName,
  StatName,
  statName,
  FuncString,
} from '@/pokemon/pokemon.type';
import { Logger } from '@nestjs/common';
import { whiteBright } from 'chalk';
import { Page } from 'puppeteer';

export class PokemonsOfDatabase extends CrawlingUtil {
  private loopCount = 893;

  constructor(page: Page) {
    super(page);
    this.initLoading(this.loopCount);

    this.promiseLocalStorage = this.initLocalStorage([
      { gdpr: '0' },
      { pokemonName },
      { pokemonTypeName },
      { statName },
      { abilityName },
      { exceptionalAbilityName },
      { eggGroupName },
      { funcString: this.funcString() },
    ]);
  }

  public crawling = async (): Promise<IPokemonOfDatabase[]> => {
    await this.promiseLocalStorage;

    let currentCount = 0;
    let pokemons: IPokemonOfDatabase[] = [];
    const waitForNavigation = this.page.waitForNavigation();
    const nextClickSelector = '.entity-nav-next';

    while (true) {
      await this.page.waitForSelector('#main');
      await this.page.waitForSelector('.tabset-basics > .tabs-panel-list > .tabs-panel');

      const pokemon = await this.page.evaluate(this.getPokemons);
      pokemon.differentForm = await this.getDifferentForm();

      pokemons = [...pokemons, pokemon];

      currentCount = +pokemon.no;
      Logger.log(whiteBright(this.getPrettyJson(pokemon)), 'Result');
      this.loading.update(currentCount);

      if (currentCount >= this.loopCount) break;

      await this.page.waitForSelector(nextClickSelector);
      await this.page.click(nextClickSelector);
      await waitForNavigation;
    }

    return pokemons;
  };

  private getPokemons = (i = 0): IPokemonOfDatabase => {
    const Util = class {
      private static private = Symbol('util');

      private type: {
        pokemonName: PokemonName;
        statName: StatName;
        pokemonTypeName: PokemonTypeName;
        abilityName: AbilityName;
        exceptionalAbilityName: ExceptionalAbilityName;
        eggGroupName: EggGroupName;
      };

      private func: FuncString;

      private $element: Element | null;

      private $elements: Element[];

      static init() {
        return new Util(this.private);
      }

      constructor(checker: any) {
        if (checker !== Util.private) throw new Error('Use Util.init()!');

        this.type = {
          pokemonName: this.getItem<PokemonName>('pokemonName'),
          statName: this.getItem<StatName>('statName'),
          pokemonTypeName: this.getItem<PokemonTypeName>('pokemonTypeName'),
          abilityName: this.getItem<AbilityName>('abilityName'),
          exceptionalAbilityName: this.getItem<ExceptionalAbilityName>('exceptionalAbilityName'),
          eggGroupName: this.getItem<EggGroupName>('eggGroupName'),
        };
        this.func = this.getItem<FuncString>('funcString');
      }

      of = ($element: Element | Element[] | NodeListOf<Element> | null): this => {
        if (!$element) this.$element = null;
        else if ($element instanceof Element) this.$element = $element;
        else this.$elements = Array.from($element);

        return this;
      };

      getItem = <T>(key: string): T => JSON.parse(localStorage.getItem(key) ?? '{}');

      getColumn = (): Element[][] => {
        const $panel = this.getElement()!.querySelectorAll('.tabset-basics > .tabs-panel-list > .tabs-panel')[i];
        const $grid = Array.from($panel.querySelectorAll('.grid-col:not(:nth-child(3))'));
        const $columns = $grid.reduce<Element[][]>((acc, $element, i, { length }) => {
          const isTable = $element.querySelector('table');
          const isTypeDefenses = length - 1 === i;
          if (isTypeDefenses) return [...acc, Array.from($element.querySelectorAll('.resp-scroll'))];

          const tableDataCell = Array.from($element.querySelectorAll('table td'));
          return [...acc, isTable ? tableDataCell : [$element]];
        }, []);
        return $columns;
      };

      getElement = (): Element | null => this.$element;

      getElements = (): Element[] => this.$elements;

      getChildren = (): Element[] => (this.$element instanceof Element ? Array.from(this.$element.children) : []);

      getText = (): string => (<Element | null>this.$element)?.textContent?.trim().replace(/é/gi, 'e') ?? '';

      getTexts = (): string[] => {
        return this.$elements.reduce<string[]>((acc, $element) => {
          const text = $element.textContent?.trim().replace(/é/gi, 'e') ?? '';
          return text ? [...acc, text] : acc;
        }, []);
      };

      getSrc = (): string => (<HTMLImageElement>this.$element)?.src ?? '';

      matchText = (regExp: RegExp): string => this.getText().match(regExp)?.[1] ?? '';

      replaceText = (searchValue: string | RegExp, replaceValue = ''): string => {
        return this.getText().replace(new RegExp(searchValue, 'gi'), replaceValue);
      };

      private parseFunction = (funcString: string) => {
        const funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gim;
        const match = funcReg.exec(funcString.replace(/\n/g, ' '));
        if (!match) return null;

        const [, func, ...funcs] = match;
        return new Function(...func.split(',').concat(funcs));
      };

      getName = (): PokemonName => {
        return this.parseFunction(this.func.getName)?.call(null, this.getText(), this.type.pokemonName);
      };

      getTypes = (): PokemonTypeName[] => {
        return this.parseFunction(this.func.getType)?.call(null, this.getTexts(), this.type.pokemonTypeName);
      };

      private getAbility = (text: string | null): string => {
        return text && this.parseFunction(this.func.getAbility)?.call(null, text, this.type.abilityName);
      };

      getAbilities = (): string[] => this.getElements().map($element => this.getAbility($element.textContent));

      getHiddenAbility = (): string | null => this.getAbility(this.getText() || null);

      getEvYield = (): string => {
        return this.parseFunction(this.func.getEvYield)?.call(null, this.getText(), this.type.statName);
      };

      getEggGroups = (): EggGroupName[] => {
        return this.parseFunction(this.func.getEggGroups)?.call(null, this.getText(), this.type.eggGroupName);
      };

      getGenders = (): IGender[] => this.parseFunction(this.func.getGender)?.call(null, this.getText());

      getEggCycles = (): IEggCycle => this.parseFunction(this.func.getEggCycles)?.call(null, this.getText());

      getStats = (): IStat[] => this.parseFunction(this.func.getStat)?.call(null, this.getTexts(), this.type.statName);

      getTypeDefenses = ($abilities: NodeListOf<Element>, $hiddenAbility: Element | null): ITypeDefense[] => {
        let typeDefenseIndex = 0;
        const $typeDefensesTabs = Array.from(document.querySelectorAll('a.tabs-tab.text-small'));
        const isTypeDefensesTabs = $typeDefensesTabs.length > 0;

        if (isTypeDefensesTabs) {
          const mergedAbilities = [...$abilities, $hiddenAbility].filter(e => e) as Element[];
          const equals = (value1: string, value2: string | null): boolean => {
            return !!value2 && new RegExp(value1, 'gi').test(value2);
          };

          const keys = this.type.exceptionalAbilityName.filter(key => {
            return mergedAbilities.some($ability => equals(key, $ability.textContent));
          });
          const index = $typeDefensesTabs.findIndex($tab => keys.some(key => !equals(key, $tab.textContent)));
          typeDefenseIndex = index > -1 ? index : 0;
        }

        const $typeDefenseElements = Array.from(this.getElements()[typeDefenseIndex].querySelectorAll('table td'));
        const typeDefenseTexts = $typeDefenseElements.map($typeDefense => $typeDefense.textContent || '1');
        return this.parseFunction(this.func.getTypeDefenses)?.call(null, typeDefenseTexts, this.type.pokemonTypeName);
      };
    };

    const { of } = Util.init();

    const [
      [_$image],
      [$no, _$types, $species, $height, $weight, _$abilities],
      [$evYield, $catchRate, $friendship, $exp],
      [$eegGroups, $gender, $eggCycles],
      $stats,
      _$typeDefenses,
    ] = of(document.querySelector('#main')).getColumn();

    const $name = document.querySelector('#main > h1');
    const $image = _$image.querySelector('img');
    const $types = _$types.childNodes as NodeListOf<Element>;
    const $abilities = _$abilities.querySelectorAll<Element>('span > a');
    const $hiddenAbility = _$abilities.querySelector('small > a');

    const no = of($no).getText();
    const korName = of($name).getName();
    const engName = of($name).getText();
    const image = of($image).getSrc();
    const types = of($types).getTypes();
    const species = of($species).getText();
    const height = of($height).matchText(/(\w.*)(?=\s\()/);
    const weight = of($weight).matchText(/(\w.*)(?=\s\()/);
    const abilities = of($abilities).getAbilities();
    const hiddenAbility = of($hiddenAbility).getHiddenAbility();
    const evYield = of($evYield).getEvYield();
    const catchRate = +of($catchRate).replaceText(/—|\s.*/);
    const friendship = +of($friendship).replaceText(/—|\s.*/);
    const exp = +of($exp).replaceText(/—|\s.*/);
    const eegGroups = of($eegGroups).getTexts();
    const gender = of($gender).getGenders();
    const eggCycles = of($eggCycles).getEggCycles();
    const stats = of($stats).getStats();
    const typeDefenses = of(_$typeDefenses).getTypeDefenses($abilities, $hiddenAbility);

    return {
      no,
      name: korName,
      engName,
      image,
      species,
      types,
      abilities,
      hiddenAbility,
      height,
      weight,
      evYield,
      catchRate,
      friendship,
      exp,
      eegGroups,
      gender,
      eggCycles,
      stats,
      typeDefenses,
      form: null,
      differentForm: [],
    };
  };

  private getDifferentForm = async (): Promise<IPokemonOfDatabase[]> => {
    let forms = await this.page.$$eval('.tabset-basics > .tabs-tab-list > .tabs-tab', $el => {
      return Array.from($el)
        .map($el => $el.textContent!)
        .filter((f, i) => i && !/partner/gi.test(f));
    });
    if (!forms.length) return [];

    forms = forms.map(this.getForm);

    const differentForms = await Promise.all(forms.map((_, i) => this.page.evaluate(this.getPokemons, i + 1)));
    return differentForms.map((differentForm, i) => ({ ...differentForm, form: forms[i] }));
  };
}
