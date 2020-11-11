import { IEggCycle, IEvolvingTo, IGender, IPokemonOfDatabase, IStat, ITypeDefense } from '@/pokemon/pokemon.interface';
import {
  abilityName,
  EggGroupName,
  eggGroupName,
  ExceptionalAbilityName,
  exceptionalAbilityName,
  PokemonName,
  pokemonName,
  PokemonTypeName,
  pokemonTypeName,
  statName,
} from '@/pokemon/pokemon.type';
import { differentFormName, DifferentFormName } from '@/pokemon/type/differentFormName';
import { CrawlingUtil, FunctionString, functionString, ProgressBar } from '@/utils';
import { Logger } from '@nestjs/common';

export class PokemonsOfDatabase extends CrawlingUtil {
  protected promiseLocalStorage = this.initLocalStorage([
    { gdpr: '0' },
    { pokemonName },
    { pokemonTypeName },
    { statName },
    { abilityName },
    { exceptionalAbilityName },
    { eggGroupName },
    { differentFormName },
    { functionString },
  ]);

  public crawling = async (): Promise<IPokemonOfDatabase[]> => {
    await this.promiseLocalStorage;

    let curser = 0;
    const numberOfLoop = 893;
    const progressBar = new ProgressBar();

    let pokemons: IPokemonOfDatabase[] = [];
    const nextClickSelector = '.entity-nav-next';

    while (true) {
      await this.page.waitForSelector('#main');
      await this.page.waitForSelector('.tabset-basics > .tabs-panel-list > .tabs-panel');

      const pokemon = await this.page.evaluate(this.getPokemons);
      pokemon.differentForm = await this.getDifferentForm();

      pokemons = [...pokemons, pokemon];

      curser = +pokemon.no;
      Logger.log(`${pokemon.no} : ${pokemon.name}`, 'Result');
      progressBar.update((curser / numberOfLoop) * 100);

      if (curser >= numberOfLoop) break;

      await this.page.waitForSelector(nextClickSelector);
      await Promise.all([this.page.click(nextClickSelector), this.page.waitForNavigation()]);
    }

    return pokemons;
  };

  private getPokemons = (i = 0): IPokemonOfDatabase => {
    const { of } = new (class {
      private condition?: string;
      private type: {
        pokemonName: typeof pokemonName;
        statName: typeof statName;
        pokemonTypeName: typeof pokemonTypeName;
        differentFormName: typeof differentFormName;
        abilityName: typeof abilityName;
        eggGroupName: typeof eggGroupName;
        exceptionalAbilityName: ExceptionalAbilityName;
      };
      private functionString: FunctionString;
      private $element: Element | null;
      private $elements: Element[];

      constructor() {
        this.type = {
          pokemonName: this.getItem<typeof pokemonName>('pokemonName'),
          statName: this.getItem<typeof statName>('statName'),
          pokemonTypeName: this.getItem<typeof pokemonTypeName>('pokemonTypeName'),
          differentFormName: this.getItem<typeof differentFormName>('differentFormName'),
          abilityName: this.getItem<typeof abilityName>('abilityName'),
          eggGroupName: this.getItem<typeof eggGroupName>('eggGroupName'),
          exceptionalAbilityName: this.getItem<ExceptionalAbilityName>('exceptionalAbilityName'),
        };
        this.functionString = this.getItem<FunctionString>('functionString');
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
      public getColumn = (): Element[][] => {
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
      public getElement = (): Element | null => this.$element;
      public getElements = (): Element[] => this.$elements;
      public getChildren = (): Element[] =>
        this.$element instanceof Element ? Array.from(this.$element.children) : [];
      public getText = (): string => (<Element | null>this.$element)?.textContent?.trim().replace(/é/gi, 'e') ?? '';
      public getTexts = (): string[] => {
        return this.$elements.reduce<string[]>((acc, $element) => {
          const text = $element.textContent?.trim().replace(/é/gi, 'e') ?? '';
          return text ? [...acc, text] : acc;
        }, []);
      };
      public getSrc = (): string => (<HTMLImageElement>this.$element)?.src ?? '';
      public matchText = (regExp: RegExp): string => this.getText().match(regExp)?.[1] ?? '';
      public replaceText = (searchValue: string | RegExp, replaceValue = ''): string => {
        return this.getText().replace(new RegExp(searchValue, 'gi'), replaceValue);
      };
      public getName = (): PokemonName => {
        return this.parseFunction(this.functionString.getName)?.call(null, this.getText(), this.type.pokemonName);
      };
      public getTypes = (): PokemonTypeName[] => {
        return this.parseFunction(this.functionString.getTypes)?.call(null, this.getTexts(), this.type.pokemonTypeName);
      };
      private getAbility = (text: string | null): string => {
        return text && this.parseFunction(this.functionString.getAbility)?.call(null, text, this.type.abilityName);
      };
      public getAbilities = (): string[] => this.getElements().map($element => this.getAbility($element.textContent));
      public getHiddenAbility = (): string | null => this.getAbility(this.getText() || null);
      public getEvYield = (): string => {
        return this.parseFunction(this.functionString.getEvYield)?.call(null, this.getText(), this.type.statName);
      };
      public getEggGroups = (): EggGroupName[] => {
        return this.parseFunction(this.functionString.getEggGroups)?.call(null, this.getText(), this.type.eggGroupName);
      };
      public getGenders = (): IGender[] =>
        this.parseFunction(this.functionString.getGender)?.call(null, this.getText());
      public getEggCycles = (): IEggCycle =>
        this.parseFunction(this.functionString.getEggCycles)?.call(null, this.getText());
      public getStats = (): IStat[] => {
        return this.parseFunction(this.functionString.getStat)?.call(null, this.getTexts(), this.type.statName);
      };
      public getTypeDefenses = ($abilities: NodeListOf<Element>, $hiddenAbility: Element | null): ITypeDefense[] => {
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
        return this.parseFunction(this.functionString.getTypeDefenses)?.call(
          null,
          typeDefenseTexts,
          this.type.pokemonTypeName,
        );
      };
      public getForm = (): string | null => {
        if (!this.$element) return null;
        const text = this.$element.textContent;
        return this.parseFunction(this.functionString.getForm)?.call(null, text, this.type.differentFormName);
      };
      private addEvolvingTo = (previous: IEvolvingTo, pokemon: IEvolvingTo | IEvolvingTo[]): void => {
        const { evolvingTo } = previous;
        const isEvolvingTo = !!evolvingTo.length;
        if (isEvolvingTo) {
          this.addEvolvingTo(evolvingTo[0], pokemon);
          return;
        }
        previous.evolvingTo = [pokemon].flat();
      };
      private getPokemon = ($element: Element): IEvolvingTo => {
        const $image = $element.querySelector('.infocard-lg-img span');
        const $no = $element.querySelector('.infocard-lg-data > small');
        const $data = $element.querySelector('.infocard-lg-data');
        const isForm = ($data?.children.length ?? 0) > 5;
        const $name = $data?.querySelector('.ent-name') ?? null;
        const $form = $data?.querySelector('small:nth-of-type(2)') ?? null;
        const form = isForm ? this.of($form).getForm() : null;

        const no = this.of($no).replaceText(/\D/);
        const name = this.of($name).getName();
        const image = $image?.getAttribute('data-src') ?? '';

        return { no, name, image, form, evolvingTo: [] };
      };
      private addCondition = ($element: Element) => {
        const isCondition = /arrow$/.test($element.className);
        if (!isCondition) return false;

        this.condition = $element?.textContent?.replace(/[()]/g, '') ?? '';
        return true;
      };
      private addMoreThanTwoKindsEvolvingTo = (previous: IEvolvingTo, $element: Element): boolean => {
        const isSplit = /split$/.test($element.className);
        if (!isSplit) return false;

        const pokemons = Array.from($element.children).map($el => {
          const $condition = $el?.querySelector('.infocard-arrow > small');
          const condition = $condition?.textContent?.replace(/[()]/g, '') ?? '';
          return { ...this.getPokemon($el.querySelector('.infocard:last-child')!), condition };
        });
        this.addEvolvingTo(previous, pokemons);

        return true;
      };
      private getEvolution = ($element: Element): IEvolvingTo => {
        return Array.from($element.children).reduce((acc, e) => {
          if (this.addMoreThanTwoKindsEvolvingTo(acc, e)) return acc;
          if (this.addCondition(e)) return acc;

          if (!acc?.no) return { ...this.getPokemon(e), condition: this.condition };
          this.addEvolvingTo(acc, { ...this.getPokemon(e), condition: this.condition });

          return acc;
        }, <IEvolvingTo>{});
      };
      public getEvolvingTo = (): IEvolvingTo[] => {
        return this.getElements().map(this.getEvolution);
      };
    })();

    const $main = document.querySelector('#main');
    const [
      [_$image],
      [$no, _$types, $species, $height, $weight, _$abilities],
      [$evYield, $catchRate, $friendship, $exp],
      [$eegGroups, $gender, $eggCycles],
      $stats,
      _$typeDefenses,
    ] = of($main).getColumn();
    const $name = document.querySelector('#main > h1');
    const $tab = document.querySelector('.tabset-basics > .tabs-tab-list > .tabs-tab.active');
    const $image = _$image.querySelector('img');
    const $types = <NodeListOf<Element>>_$types.childNodes;
    const $abilities = _$abilities.querySelectorAll<Element>('span > a');
    const $hiddenAbility = _$abilities.querySelector('small > a');
    const $evolvingTo = document.querySelectorAll('#main > div.infocard-list-evo');

    const tabName = of($tab).getText();
    const engName = of($name).getText();
    const isForm = tabName === engName ? null : true;

    return {
      no: of($no).getText(),
      name: of($name).getName(),
      engName,
      image: of($image).getSrc(),
      types: of($types).getTypes(),
      species: of($species).getText(),
      height: of($height).matchText(/(\w.*)(?=\s\()/),
      weight: of($weight).matchText(/(\w.*)(?=\s\()/),
      abilities: of($abilities).getAbilities(),
      hiddenAbility: of($hiddenAbility).getHiddenAbility(),
      evYield: of($evYield).getEvYield(),
      catchRate: +of($catchRate).replaceText(/—|\s.*/),
      friendship: +of($friendship).replaceText(/—|\s.*/),
      exp: +of($exp).replaceText(/—|\s.*/),
      eegGroups: of($eegGroups).getEggGroups(),
      gender: of($gender).getGenders(),
      eggCycles: of($eggCycles).getEggCycles(),
      stats: of($stats).getStats(),
      typeDefenses: of(_$typeDefenses).getTypeDefenses($abilities, $hiddenAbility),
      evolvingTo: of($evolvingTo).getEvolvingTo(),
      form: isForm && of($tab).getForm(),
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

  private getForm = (text: string): DifferentFormName => {
    const convertKeyToRegExp = (key: string): RegExp => new RegExp(key.replace(/_/g, ''), 'gi');

    let form: DifferentFormName;
    try {
      [, form] = Object.entries(differentFormName).find(([key]) => {
        return convertKeyToRegExp(key).test(text.replace(/[^a-z0-9]/gi, ''));
      })!;
    } catch (error) {
      Logger.error(`No Matching Form Found ${text}`, undefined, 'Error');
      throw error;
    }
    return form;
  };
}
