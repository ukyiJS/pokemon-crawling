import { CrawlingUtil, ProgressBar } from '@/utils';
import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer-extra/dist/puppeteer';
import { IPokemonWiki } from '../interfaces/pokemonWiki.interface';
import { ColorType } from '../types/color.type';
import { GenderType } from '../types/gender.type';

export class CrawlingPokemonsWiki extends CrawlingUtil {
  public crawling = async (page: Page): Promise<IPokemonWiki[]> => {
    let curser = 0;
    const loopCount = 893;
    const { updateProgressBar } = new ProgressBar(loopCount);

    let pokemons = <IPokemonWiki[]>[];
    const nextClickSelector = '.w-100.mb-1 > tbody > tr > td:last-child td:last-child > a';

    while (true) {
      await page.waitForSelector('.infobox-pokemon');

      const pokemon = await page.evaluate(this.getPokemons);

      pokemons = [...pokemons, pokemon];

      curser = +pokemon.no;
      Logger.log(`${pokemon.no} : ${pokemon.name}`, 'Result');
      updateProgressBar((curser / loopCount) * 100);

      if (curser >= loopCount) break;
      await this.onPageClick(page, nextClickSelector);
    }
    return pokemons;
  };

  private getPokemons = (): IPokemonWiki => {
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
      public getColors = (): ColorType => {
        const $code = this.getElement()?.querySelector('span');
        const name = of(this.getElement()).getText();
        const code = $code?.getAttribute('style')?.replace(/background:/, '') ?? '';
        return { name, code };
      };
      public getGender = (): GenderType[] => {
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
      public getEegGroups = (): string[] => {
        return of(this.getElement()?.querySelectorAll('a:not(:first-child)')).getTexts();
      };
      public getPokemon = (): IPokemonWiki => {
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
          $catchRate,
          $gender,
          $eegGroups,
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
          catchRate: +of($catchRate).getText(),
          gender: of($gender).getGender(),
          eegGroups: of($eegGroups).getEegGroups(),
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
      })
      .map(form => {
        return form
          .replace(/(^알로라|^가라르).*/, '$1 폼')
          .replace(/(^메가).*X$/, '$1진화X')
          .replace(/(^메가).*Y$/, '$1진화Y')
          .replace(/(^메가).*/, '$1진화')
          .replace(/(^거다이맥스).*/, '$1');
      });

    const isForm = formName ? $differentForm.length === differentFormNames.length : false;
    const form = isForm ? formName : null;
    const pokemon = { ...of($pokemon).getPokemon(), form };

    const differentForm = $differentForm.map(($pokemon, i) => {
      const { name } = pokemon;
      const forms = [formName, ...differentFormNames];
      const form = forms[i].replace(/리전폼/g, () => {
        return /파오리|불비달마/g.test(name) ? '가라르 폼' : '알로라 폼';
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
