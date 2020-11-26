/* eslint-disable no-console */
import { IColor, IGender, IPokemonOfWiki } from '@/pokemon/pokemon.interface';
import { ProgressBar } from '@/utils';
import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer-extra/dist/puppeteer';

export class PokemonsOfWiki {
  constructor(private readonly page: Page) {}
  public crawling = async (): Promise<IPokemonOfWiki[]> => {
    let curser = 0;
    const numberOfLoop = 893;
    const progressBar = new ProgressBar();

    let pokemons = <IPokemonOfWiki[]>[];
    const nextClickSelector = '.w-100.mb-1 > tbody > tr > td:last-child td:last-child > a';

    while (true) {
      await this.page.waitForSelector('.infobox-pokemon');

      const pokemon = await this.page.evaluate(this.getPokemons);

      pokemons = [...pokemons, pokemon];

      curser = +pokemon.no;
      Logger.log(`${pokemon.no} : ${pokemon.name}`, 'Result');
      progressBar.update((curser / numberOfLoop) * 100);

      if (curser >= numberOfLoop) break;

      try {
        await this.page.waitForSelector(nextClickSelector);
        await Promise.all([
          this.page.click(nextClickSelector),
          this.page.waitForNavigation({ waitUntil: 'load', timeout: 10000 }),
        ]);
      } catch (error) {
        if (error.name !== 'TimeoutError') throw error;
        Logger.error(error.message, error.stack, error.name);
      }
    }

    return pokemons;
  };

  private getPokemons = (): IPokemonOfWiki => {
    const { of } = new (class {
      private $element: Element | null;
      private $elements: Element[];

      public of = ($element?: Element | Element[] | NodeListOf<Element> | null): this => {
        if (!$element) this.$element = null;
        else if ($element instanceof Element) this.$element = $element;
        else this.$elements = Array.from($element);

        return this;
      };
      public getElement = (): Element | null => this.$element;
      public getElements = (): Element[] => this.$elements;
      public getText = (): string => {
        const text = this.getElement()?.textContent;
        return text ? text.trim().replace(/é/gi, 'e') : '';
      };
      public getTexts = (): string[] => {
        return this.getElements().reduce<string[]>((acc, $element) => {
          const text = of($element).getText();
          return text ? [...acc, text] : acc;
        }, []);
      };
      public replaceText = (searchValue: string | RegExp, replaceValue = ''): string => {
        return this.getText().replace(new RegExp(searchValue, 'gi'), replaceValue);
      };
      public getContentsElements = (): Element[] => {
        return Array.from(this.getElement()?.querySelectorAll('.body > tbody > tr > td:not(.nostyle)') ?? []);
      };
      public getNo = (): string => of(this.getElement()?.querySelector('.index')).replaceText(/\D/);
      public getNames = (): { name: string; engName: string } => {
        const [name, , engName] = of(this.getElement()?.querySelectorAll(`div[class^='name-']`) ?? []).getTexts();
        return { name, engName };
      };
      public getImage = (): string => {
        const href = (<HTMLAnchorElement>this.getElement()?.querySelector('a'))?.href ?? '';
        const src = (<HTMLImageElement>this.getElement()?.querySelector('img'))?.src ?? '';
        return href || src;
      };
      public getTypes = (): string[] => of(this.getElement()?.querySelectorAll('a span')).getTexts();
      public getHiddenAbility = (): string | null => {
        const hiddenAbility = of(this.getElement()).getText() || null;
        return hiddenAbility && /없음/g.test(hiddenAbility) ? null : hiddenAbility;
      };
      public getAbilities = (): (string | null)[] => {
        const [ability1, ability2 = null] = of(this.getElement()?.querySelectorAll('a span')).getTexts();
        return [ability1, ability2];
      };
      public getColors = (): IColor => {
        const $code = this.getElement()?.querySelector('span');
        const name = of(this.getElement()).getText();
        const code = $code?.getAttribute('style')?.replace(/background:/, '') ?? '';
        return { name, code };
      };
      public getGender = (): IGender[] => {
        const genderless = [{ name: '무성', ratio: 100 }];
        const match = of(this.getElement())
          .getText()
          .match(/(\d.*)(?=%).*(?<=:)(\d.*)(?=%)/);
        if (!match) return genderless;
        const [, male, female] = match;
        return [
          { name: '수컷', ratio: +male },
          { name: '암컷', ratio: +female },
        ];
      };
      public getPokemon = (): IPokemonOfWiki => {
        const $pokemon = this.getElement();
        const [
          $types,
          $species,
          $abilities,
          $hiddenAbility,
          ,
          ,
          ,
          $color,
          $friendship,
          $height,
          $weight,
          $captureRate,
          $gender,
        ] = of($pokemon).getContentsElements();

        const abilities = of($abilities).getAbilities();
        const hiddenAbility = of($hiddenAbility).getHiddenAbility();

        return {
          no: of($pokemon).getNo(),
          ...of($pokemon).getNames(),
          image: of($pokemon).getImage(),
          species: of($species).getText(),
          types: of($types).getTypes(),
          abilities: abilities.concat(hiddenAbility),
          hiddenAbility,
          color: of($color).getColors(),
          friendship: +of($friendship).getText(),
          height: of($height).getText(),
          weight: of($weight).getText(),
          captureRate: +of($captureRate).getText(),
          gender: of($gender).getGender(),
          form: null,
        };
      };
    })();

    const [$pokemon, ...$differentForm] = of(document.querySelectorAll('.infobox-pokemon')).getElements();
    const [formName, ...differentFormNames] = of(document.querySelectorAll('#pokemonToggle td'))
      .getTexts()
      .filter((form, i) => {
        if (i > 0) return true;
        const name = $pokemon?.querySelector('.name-ko')?.textContent?.trim();
        return !/기존폼|평상시/.test(form) && form !== name;
      });

    const isForm = formName ? $differentForm.length === differentFormNames.length : false;
    const form = isForm ? formName : null;
    const pokemon = { ...of($pokemon).getPokemon(), form };

    const differentForm = $differentForm.map(($pokemon, i) => {
      const { name } = pokemon;
      const forms = [formName, ...differentFormNames];
      const form = forms[i].replace(/리전폼/g, () => {
        return /파오리|불비달마/g.test(name) ? `가라르 ${name}` : `알로라 ${name}`;
      });

      if (/^메가|^원시|^울트라/g.test(form)) {
        const [, , , $height, $weight] = of($pokemon).getContentsElements();
        return {
          ...pokemon,
          image: of($pokemon).getImage(),
          height: of($height).getText(),
          weight: of($weight).getText(),
          form,
        };
      }

      return { ...of($pokemon).getPokemon(), form };
    });

    return { ...pokemon, differentForm };
  };
}
