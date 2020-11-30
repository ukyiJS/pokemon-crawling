import { ProgressBar } from '@/utils';
import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer-extra/dist/puppeteer';
import { EggCycle, EvolvingTo, Gender, PokemonOfDatabase, Stat, TypeDefense } from '../pokemon.interface';
import { CrawlingUtil } from './util';

export class CrawlingPokemonOfDatabase extends CrawlingUtil {
  public crawling = async (page: Page): Promise<PokemonOfDatabase[]> => {
    let pokemons = <PokemonOfDatabase[]>[];
    let curser = 0;
    const loopCount = 6;
    const { updateProgressBar } = new ProgressBar(loopCount);

    const mainSelector = '#main';
    const tabSelector = '.tabset-basics > .tabs-panel-list > .tabs-panel';
    const nextClickSelector = '.entity-nav-next';

    while (true) {
      const [$main] = await Promise.all([page.waitForSelector(mainSelector), page.waitForSelector(tabSelector)]);
      const pokemon = await page.evaluate(this.getPokemon, $main);
      pokemons = [...pokemons, pokemon];

      curser = +pokemon?.no;
      Logger.log(`${pokemon.no} : ${pokemon.name}`, 'Crawling');
      updateProgressBar(curser);

      if (curser >= loopCount) break;
      await this.onPageClick(page, nextClickSelector);
    }
    return pokemons;
  };

  private getPokemon = ($main: Element): PokemonOfDatabase => {
    const { of } = new (class {
      private $element: Element | null;
      private $elements: Element[];
      private condition: string;

      public of = ($element?: Element | Element[] | NodeListOf<Element> | null): this => {
        if (!$element) this.$element = null;
        else if ($element instanceof Element) this.$element = $element;
        else this.$elements = Array.from($element);

        return this;
      };
      private getRegExp = (regExp: string | RegExp) => RegExp(regExp, 'gi');
      public getText = (): string => this.$element?.textContent?.trim().replace(/é/gi, 'e') ?? '';
      public getTexts = (): string[] => {
        return this.$elements.reduce<string[]>((acc, $element) => {
          const text = $element.textContent?.trim().replace(/é/gi, 'e') ?? '';
          return text ? [...acc, text] : acc;
        }, []);
      };
      public matchText = (regExp: RegExp): string => this.getText().match(regExp)?.[1] ?? '';
      public replaceText = (searchValue: string | RegExp, replaceValue = ''): string => {
        return this.getText().replace(this.getRegExp(searchValue), replaceValue);
      };
      public equals = (value1: string, value2: string | null): boolean => {
        return !!value2 && this.getRegExp(value1).test(value2);
      };
      public getChildren = (): Element[] => (this.$element ? Array.from(this.$element.children) : []);
      public getPokemonElements = (): Element[] => Array.from(this.$elements);
      private getSrc = (): string => {
        const src = this.$element?.getAttribute('src') ?? this.$element?.getAttribute('data-src') ?? '';
        return src.replace(/(rockruff)-own-tempo.png$/g, '$1.png');
      };
      public getFormNames = (): string[] => {
        const formNames = this.$elements.map($element => of($element).replaceText(/[^a-z0-9]/));
        return formNames.filter(name => !/partner/gi.test(name));
      };
      public getColumn = (): Element[][] => {
        const $grid = Array.from(this.$element?.querySelectorAll('.grid-col:not(:nth-child(3))') ?? []);
        const $columns = $grid.reduce<Element[][]>((acc, $element, i, { length }) => {
          const isTable = $element.querySelector('table');
          const isTypeDefenses = length - 1 === i;
          if (isTypeDefenses) return [...acc, Array.from($element.querySelectorAll('.resp-scroll'))];

          const tableDataCell = Array.from($element.querySelectorAll('table td'));
          return [...acc, isTable ? tableDataCell : [$element]];
        }, []);
        return $columns;
      };
      public getName = (): string => of(this.$element?.querySelector('h1')).getText();
      public getImage = (): string => of(this.$element?.querySelector('img')).getSrc();
      public getTypes = (): string[] => of(this.$element?.querySelectorAll('a')).getTexts();
      public getHeightOrWeight = (): string => this.matchText(/(\w.*)(?=\s\()/).replace(/\s/g, '');
      public getAbilities = (): (string | null)[] => {
        const $abilities = Array.from(this.$element?.querySelectorAll('span > a') ?? []);
        const [ability1 = null, ability2 = null] = $abilities.map($ability => of($ability).replaceText(/[^a-z]/));
        return [ability1, ability2];
      };
      public getHiddenAbility = (): string | null => {
        return of(this.$element?.querySelector('small > a')).replaceText(/[^a-z]/) || null;
      };
      public getEvYield = (): string | null => of(this.$element).replaceText(/(?<=\D)\s/) || null;
      public getCatchRate = (): number => +of(this.$element).matchText(/(\d+)/);
      public getFriendship = (): number => +of(this.$element).matchText(/(\d+)/) || 70;
      public getExp = (): number => +of(this.$element).matchText(/(\d+)/);
      public getEegGroups = (): string[] => of(this.$element?.querySelectorAll('a')).getTexts();
      public getGender = (): Gender[] => {
        const match = this.getText().match(/(\d.*)(?=%).*(?<=,\s)(\d.*)(?=%)/);
        const genderless = [{ name: '무성', ratio: 100 }];
        if (!match) return genderless;

        const [, male, female] = match;
        return [
          { name: '수컷', ratio: +male },
          { name: '암컷', ratio: +female },
        ];
      };
      public getEggCycle = (): EggCycle | null => {
        const match = this.getText().match(/(\d.*)(?:\s\()(\d.*)(?:\ssteps)/);
        if (!match) return null;

        const [, cycle, step] = match;
        return {
          value: +cycle,
          step: step.split('–').map(step => +step.replace(/\D/g, '')),
        };
      };
      public getStats = (): Stat[] => {
        const statNames = ['체력', '공격', '방어', '특수공격', '특수방어', '스피드', '총합'];
        return this.getTexts()
          .filter((_, i) => !(i % 4))
          .map((value, i) => ({ name: statNames[i], value: +value }));
      };
      public getTypeDefenseIndex = (abilities: (string | null)[]): number => {
        const typeDefenseTabNames = of($main.querySelectorAll('a.tabs-tab.text-small')).getTexts();
        const isTypeDefenseTabNames = typeDefenseTabNames.length > 0;
        if (!isTypeDefenseTabNames) return 0;

        const exceptionalAbilities = [
          'Thick Fat',
          'Levitate',
          'Storm Drain',
          'Lightning Rod',
          'Motor Drive',
          'Sap Sipper',
          'Dry Skin',
          'Water Absorb',
          'Volt Absorb',
          'Flash Fire',
          'Fluffy',
        ].filter(exceptionalAbility => {
          return abilities.filter(ability => ability).some(ability => this.equals(exceptionalAbility, ability));
        });

        const index = typeDefenseTabNames.findIndex(name => {
          return exceptionalAbilities.some(exceptionalAbility => !this.equals(exceptionalAbility, name));
        });
        return index > -1 ? index : 0;
      };
      public getTypeDefenses = (abilities: (string | null)[]): TypeDefense[] => {
        const { $elements } = this;
        const typeDefenseIndex = this.getTypeDefenseIndex(abilities);
        const $typeDefenseTables = Array.from($elements[typeDefenseIndex].querySelectorAll('table'));
        const [types, damages] = $typeDefenseTables.reduce<string[][]>(
          ([types, damages], $table) => {
            const type = Array.from($table.querySelectorAll('th > a')).map($a => (<HTMLAnchorElement>$a).title);
            const damage = Array.from($table.querySelectorAll('td')).map($td => of($td).getText() || '1');
            return [types.concat(type), damages.concat(damage)];
          },
          [[], []],
        );

        const convertToDamage = (text: string) => {
          return +text.replace(/(½)|(¼)/g, (_, g1, g2) => (g1 && '0.5') || (g2 && '0.25'));
        };
        return types.map((type, i) => ({ type, damage: convertToDamage(damages[i]) }));
      };
      private addCondition = (): boolean => {
        const isCondition = /arrow$/.test(this.$element?.className ?? '');
        if (!isCondition) return false;

        this.condition = of(this.$element).replaceText(/[()]/);

        return true;
      };
      private addEvolvingTo = (previous: EvolvingTo, pokemon: EvolvingTo | EvolvingTo[]): void => {
        const { evolvingTo } = previous;
        if (evolvingTo?.length) {
          this.addEvolvingTo(evolvingTo[0], pokemon);
          return;
        }
        previous.evolvingTo = [pokemon].flat();
      };
      private addMoreThanTwoKindsEvolvingTo = (previous: EvolvingTo): boolean => {
        const isSplit = /split$/.test(this.$element?.className ?? '');
        if (!isSplit) return false;

        const pokemons = <EvolvingTo[]>of(this.$element)
          .getChildren()
          .map($el => {
            const condition = of($el.querySelector('.infocard-arrow > small')).replaceText(/[()]/);
            return { ...of($el.querySelector('.infocard:last-child')).getEvolutionPokemon(), condition };
          });
        this.addEvolvingTo(previous, pokemons);

        return true;
      };
      public getEvolutionPokemon = (): EvolvingTo => {
        const $element = this.$element!;

        const $image = $element.querySelector('.infocard-lg-img .img-sprite');
        const $data = $element.querySelector('.infocard-lg-data');

        const no = of($element.querySelector('.infocard-lg-data > small')).replaceText(/\D/);
        const name = of($data?.querySelector('.ent-name')).getText();
        const image = of($image).getSrc();
        const isForm = of($data).getChildren().length > 5;
        const form = isForm ? of($data?.querySelector('small:nth-of-type(2)')).getText() : null;

        return { no, name, image, form, condition: this.condition, evolvingTo: [] };
      };
      public getEvolvingTo = (): EvolvingTo[] => {
        return this.$elements.map($element => {
          return of($element)
            .getChildren()
            .reduce((acc, e) => {
              const { addMoreThanTwoKindsEvolvingTo, addCondition, getEvolutionPokemon } = of(e);
              if (addMoreThanTwoKindsEvolvingTo(acc)) return acc;
              if (addCondition()) return acc;

              const pokemon = getEvolutionPokemon();
              if (!acc?.no) return pokemon;
              this.addEvolvingTo(acc, pokemon);

              return acc;
            }, <EvolvingTo>{});
        });
      };
      public getPokemon = (): PokemonOfDatabase => {
        const [
          [$image],
          [$no, $types, $species, $height, $weight, $abilities],
          [$evYield, $catchRate, $friendship, $exp],
          [$eegGroups, $gender, $eggCycles],
          $stats,
          $typeDefenses,
        ] = of(this.$element).getColumn();
        const abilities = of($abilities).getAbilities();
        const hiddenAbility = of($abilities).getHiddenAbility();
        const mergedAbilities = abilities.concat(hiddenAbility);

        const pokemon = {
          no: of($no).getText(),
          name: of($main).getName(),
          image: of($image).getImage(),
          types: of($types).getTypes(),
          species: of($species).getText(),
          height: of($height).getHeightOrWeight(),
          weight: of($weight).getHeightOrWeight(),
          abilities: mergedAbilities,
          hiddenAbility,
          evYield: of($evYield).getEvYield(),
          catchRate: of($catchRate).getCatchRate(),
          friendship: of($friendship).getFriendship(),
          exp: +of($exp).getExp(),
          eegGroups: of($eegGroups).getEegGroups(),
          gender: of($gender).getGender(),
          eggCycle: of($eggCycles).getEggCycle(),
          stats: of($stats).getStats(),
          typeDefenses: of($typeDefenses).getTypeDefenses(mergedAbilities),
          form: null,
        };
        return pokemon;
      };
    })();
    const $tabsPanel = $main.querySelectorAll('.tabset-basics > .tabs-panel-list > .tabs-panel');
    const $pokemons = of($tabsPanel).getPokemonElements();
    const $formNames = $main.querySelectorAll('.tabset-basics > .tabs-tab-list > .tabs-tab');
    const $evolvingTo = document.querySelectorAll('#main > div.infocard-list-evo');

    const [pokemon, ...pokemons] = $pokemons.map($pokemon => of($pokemon).getPokemon());
    const { evYield, catchRate, friendship, eegGroups, gender, eggCycle } = pokemon;

    const [formName, ...formNames] = of($formNames).getFormNames();
    const isForm = formName === pokemon.name ? null : true;
    const form = isForm && formName;
    const differentForm = pokemons.map((pokemon, i) => {
      const form = formNames[i];
      const commonInfo = { evYield, catchRate, friendship, eegGroups, gender, eggCycle };
      if (/^GalarianZenMode/gi.test(form)) commonInfo.evYield = '2 SpecialAttack';
      return { ...pokemon, ...commonInfo, form };
    });

    return { ...pokemon, evolvingTo: of($evolvingTo).getEvolvingTo(), form, differentForm };
  };
}
