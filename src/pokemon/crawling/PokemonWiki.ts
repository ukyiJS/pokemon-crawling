import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer-extra/dist/puppeteer';
import { IPokemonWiki } from '../interfaces/pokemonWiki.interface';
import { ColorType } from '../types/color.type';
import { GenderType } from '../types/gender.type';
import { LanguageType } from '../types/language.type';
import { CrawlingUtil } from './crawlingUtil';

export class CrawlingPokemonWiki extends CrawlingUtil {
  public crawling = async (page: Page, loopCount: number): Promise<IPokemonWiki[]> => {
    let curser = 0;
    let pokemons = <IPokemonWiki[]>[];
    const nextClickSelector = '.w-100.mb-1 > tbody > tr > td:last-child td:last-child > a';

    while (true) {
      await page.waitForSelector('.infobox-pokemon');

      const pokemon = await page.evaluate(this.getPokemons);
      pokemons = [...pokemons, pokemon];
      curser = +pokemon.no;

      Logger.log(`${pokemon.no} : ${pokemon.name.kor}`, 'Result');
      this.updateProgressBar(curser, loopCount);

      if (curser >= loopCount) break;
      await this.onPageClick(page, nextClickSelector);
    }
    return this.getUniqueObjectArray(pokemons, 'no');
  };

  private getPokemons = (): IPokemonWiki => {
    const { of } = new (class {
      private $element: Element | null;
      private $elements: Element[];

      public of = <T extends Element>($element?: T | T[] | NodeListOf<T> | null): this => {
        if (!$element) this.$element = null;
        else if ($element instanceof Element) this.$element = $element;
        else this.$elements = Array.from($element);

        return this;
      };
      public getText = (): string => {
        const text = this.$element?.textContent;
        return text ? text.trim().replace(/é/gi, 'e') : '';
      };
      public getTexts = (): string[] => {
        return this.$elements.reduce<string[]>((acc, $element) => {
          const text = of($element).getText();
          return text ? [...acc, text] : acc;
        }, []);
      };
      public replaceText = (searchValue: string | RegExp, replaceValue = ''): string => {
        return this.getText().replace(new RegExp(searchValue, 'gi'), replaceValue);
      };
      public getContentsElements = (): Element[] => {
        return Array.from(this.$element?.querySelectorAll('.body > tbody > tr > td:not(.nostyle)') ?? []);
      };
      public getNo = (): string => of(this.$element?.querySelector('.index')).replaceText(/\D/);
      public getNames = (): LanguageType => {
        const [kor, , eng] = of(this.$element?.querySelectorAll(`div[class^='name-']`) ?? []).getTexts();
        return { kor, eng };
      };
      public getImage = (): string => {
        const href = (<HTMLAnchorElement>this.$element?.querySelector('a'))?.href ?? '';
        const src = (<HTMLImageElement>this.$element?.querySelector('img'))?.src ?? '';
        return href || src;
      };
      public getTypes = (): string[] => of(this.$element?.querySelectorAll('a span')).getTexts();
      public getHiddenAbility = (): string | null => {
        const hiddenAbility = of(this.$element?.querySelector('a')).getText() || null;
        return hiddenAbility && /없음/g.test(hiddenAbility) ? null : hiddenAbility;
      };
      public getAbilities = (): (string | null)[] => {
        const [ability1, ability2 = null] = of(this.$element?.querySelectorAll('a span')).getTexts();
        return [ability1, ability2];
      };
      public getColors = (): ColorType => {
        const $code = this.$element?.querySelector('span');
        const name = of(this.$element).getText();
        const code = $code?.getAttribute('style')?.replace(/background:/, '') ?? '';
        return { name, code };
      };
      public getGender = (): GenderType[] => {
        const genderless = [{ name: '무성', ratio: 100 }];
        const match = of(this.$element)
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
        return of(this.$element?.querySelectorAll('a:not(:first-child)')).getTexts();
      };
      public getFormName = (): string => {
        const form = of(this.$element).getText();
        const regExp = /(메가).*x$|(메가).*y$|^(알로라)|^(가라르)|^(메가).*|^(원시).*|(.*)모양$|^(거다이맥스).*/gi;
        return form.replace(regExp, (str, ...$$) => {
          const index = $$.findIndex(str => str);
          const matchText = $$[index];
          switch (index) {
            case 0:
              return `${matchText}진화X`;
            case 1:
              return `${matchText}진화Y`;
            case 2:
            case 3:
              return `${matchText} 폼`;
            case 4:
              return `${matchText}진화`;
            case 5:
              return `${matchText}회귀`;
            case 6:
              return `${matchText}모습`;
            case 7:
              return matchText;
            default:
              return str;
          }
        });
      };
      public getFormNames = (): string[] => {
        return this.$elements
          .filter((_, i) => i > 0)
          .filter($el => {
            const name = of(document.querySelector('.name-ko')).getText();
            const form = of($el).getText();
            return !/기존폼|평상시|^캐스퐁/.test(form) && form !== name;
          })
          .map($el => of($el).getFormName());
      };
      public getPokemon = (): IPokemonWiki => {
        const $pokemon = this.$element;
        const [$types, $species, $abilities, $hiddenAbility, , , , $color, $friendship, $height, $weight, $catchRate, $gender, $eegGroups] = of(
          $pokemon,
        ).getContentsElements();

        const no = of($pokemon).getNo();
        const abilities = of($abilities).getAbilities();
        const hiddenAbility = of($hiddenAbility).getHiddenAbility();
        const color = no === '006' ? { name: '파랑', code: '#3088f0' } : of($color).getColors();

        return {
          no,
          name: of($pokemon).getNames(),
          image: of($pokemon).getImage(),
          species: of($species).getText(),
          types: of($types).getTypes(),
          abilities: abilities.concat(hiddenAbility),
          hiddenAbility,
          color,
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

    const [$pokemon, ...$differentForm] = Array.from(document.querySelectorAll('.infobox-pokemon'));
    const [formName, ...differentFormNames] = of(document.querySelectorAll('#pokemonToggle > tbody > tr > td')).getFormNames();

    const isForm = formName ? $differentForm.length === differentFormNames.length : false;
    const form = isForm ? formName : null;
    const pokemon = { ...of($pokemon).getPokemon(), form };

    const differentForm = $differentForm.map(($pokemon, i) => {
      const forms = [formName, ...differentFormNames];
      const form = forms[i].replace(/리전폼/g, () => {
        return /파오리|불비달마/g.test(pokemon.name.kor) ? '가라르 폼' : '알로라 폼';
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
