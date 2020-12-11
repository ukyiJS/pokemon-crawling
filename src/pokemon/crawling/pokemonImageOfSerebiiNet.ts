import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer-extra/dist/puppeteer';
import { ISerebiiNet } from '../interfaces/serebiiNet.interface';
import { SerebiiNet } from '../model/serebiiNet.entity';
import { LanguageType } from '../types/language.type';
import { SerebiiNetType } from '../types/serebiiNet.type';
import { CrawlingUtil } from './crawlingUtil';

export class CrawlingPokemonImageOfSerebiiNet extends CrawlingUtil {
  public crawling = async (page: Page, loopCount: number): Promise<ISerebiiNet[]> => {
    let curser = 0;
    let pokemons = <SerebiiNet[]>[];
    const nextClickSelector = 'main > table:last-child > tbody > tr > td:last-child a';

    while (true) {
      await page.waitForSelector('#content > main > div > table.dextable > tbody > tr');

      const pokemon = await page.evaluate(this.getPokemonOfSerebiiNet);
      pokemons = [...pokemons, pokemon];

      curser = +pokemon.no;
      Logger.log(`${pokemon.no} : ${pokemon.name.kor}`, 'Result');
      this.updateProgressBar(curser, loopCount);

      if (curser >= loopCount) break;
      await this.onPageClick(page, nextClickSelector);
    }

    return this.getUniqueObjectArray(pokemons, 'no');
  };

  private getPokemonOfSerebiiNet = (): ISerebiiNet => {
    const { of } = new (class {
      private $element: Element | null;
      private $elements: Element[];
      private no: string;
      private name: LanguageType;
      private image: string;

      public of = <T extends Element>($element?: T | T[] | NodeListOf<T> | null): this => {
        if (!$element) this.$element = null;
        else if ($element instanceof Element) this.$element = $element;
        else this.$elements = Array.from($element);

        return this;
      };
      public getColumn = (): Element[][] => {
        const [_$image, _$name, _$no] = this.getChildren().filter((_, i) => i < 3);
        const $no = _$no.querySelector('tr > td:last-child')!;
        const $image = _$image.querySelector('img')!;
        const $name = Array.from(_$name.querySelectorAll('tr:nth-child(4n + 1) > td:last-child'));
        const $table = Array.from(document.querySelectorAll('#content > main > table.dextable'));
        const hasTitle = ($element: Element, regExp: RegExp): boolean => {
          const title = of($element.querySelector('td')).getText();
          return RegExp(regExp, 'gi').test(title);
        };

        const $differentFormTable = $table.find(e => hasTitle(e, /^alternate/));
        const $megaEvolutionTable = $table.find(e => hasTitle(e, /^mega/));
        const $dynamaxTable = $table.find(e => hasTitle(e, /^gigantamax/));

        const $differentForm = Array.from($differentFormTable?.querySelectorAll('tr:last-child tr:nth-child(2) > td > img') ?? []);
        const $megaEvolution = Array.from($megaEvolutionTable?.querySelectorAll('td > img') ?? []);
        const $gigantamax = Array.from($dynamaxTable?.querySelectorAll('td > img') ?? []);

        return [[$no], $name, [$image], $differentForm, $megaEvolution, $gigantamax];
      };
      public getText = (): string => (<Element | null>this.$element)?.textContent?.trim().replace(/é/gi, 'e') ?? '';
      public getTexts = (): string[] => {
        return this.$elements.reduce<string[]>((acc, $element) => {
          const text = of($element).getText().replace(/é/gi, 'e') ?? '';
          return text ? [...acc, text] : acc;
        }, []);
      };
      public replaceText = (searchValue: string | RegExp, replaceValue = ''): string => {
        return this.getText().replace(new RegExp(searchValue, 'gi'), replaceValue);
      };
      private getChildren = () => Array.from(this.$element?.children ?? []);
      private toCamelCase = (text: string): string => {
        return text
          .toLowerCase()
          .replace(/\s+(\w|$)/g, (_, $1) => $1.toUpperCase())
          .replace(/[^a-z0-9♂♀]/gi, '');
      };
      public getPokemon = (): ISerebiiNet => {
        const [[$no], $name, [$image], $differentForm, $megaEvolution, $dynamax] = of(this.$element).getColumn();
        const [eng, kor] = of($name).getTexts();

        this.no = of($no).replaceText(/#/);
        this.name = { eng, kor };
        this.image = of($image).getSrc();

        const exceptionalPokemon = this.getExceptionalPokemon(eng);
        if (exceptionalPokemon) {
          const { no, name } = exceptionalPokemon;
          this.no = no;
          this.name = name;
        }

        const { no, name, image } = this;
        const differentForm = of($differentForm).getDifferentForm();
        const megaEvolution = of($megaEvolution).getDifferentEvolution();
        const dynamax = of($dynamax).getDifferentEvolution();

        return { no, name, image, form: null, differentForm: differentForm.concat(megaEvolution, dynamax) };
      };
      private getForm = (): string => {
        const alt = of(this.$element).getAlt();

        const form = this.toCamelCase(alt);
        const regExp = /(mega).*x$|(mega).*y$|^(galar)ian.*|^(gigantamax).*|^(primal).*|^(mega).*|(form)e$/gi;
        return form.replace(regExp, (str, ...$$) => {
          const index = $$.findIndex(str => str);
          const matchText = $$[index];
          switch (index) {
            case 0:
              return `${matchText}X`;
            case 1:
              return `${matchText}Y`;
            case 2:
              return `${matchText}Form`;
            case 3:
              return 'dynamax';
            case 4:
            case 5:
            case 6:
              return matchText;
            default:
              return str;
          }
        });
      };
      private getDifferentForm = (): SerebiiNetType[] => {
        return this.$elements.map(e => {
          const { no, name } = this;
          const image = of(e).getSrc();
          const form = of(e).getForm();
          return { no, name, image, form };
        });
      };
      private getDifferentEvolution = (): SerebiiNetType[] => {
        return this.$elements.map(e => {
          const { no, name } = this;
          const image = of(e).getSrc();
          const form = of(e).getForm();
          return { no, name, image, form };
        });
      };
      private getSrc = (): string => (<HTMLImageElement>this.$element)?.src ?? '';
      private getAlt = (): string => {
        const alt = (<HTMLImageElement>this.$element)?.alt;
        if (!alt) return '';

        return alt.replace(/Unovan Form (Standard Mode)$|Unovan (Zen Mode)$/gi, '$1$2').replace(/artwork/gi, '') ?? '';
      };
      private getExceptionalPokemon = (eng: string): { no: string; name: LanguageType } | null => {
        const exceptionalPokemons = [
          { eng: 'Kubfu', kor: '치고마' },
          { eng: 'Urshifu', kor: '우라오스' },
          { eng: 'Zarude', kor: '자루도' },
          { eng: 'Regieleki', kor: '레지에레키' },
          { eng: 'Regidrago', kor: '레지드래고' },
          { eng: 'Glastrier', kor: '블리자포스' },
          { eng: 'Spectrier', kor: '레이스포스' },
        ];

        const exceptionalPokemonIndex = exceptionalPokemons.findIndex(p => p.eng === eng);
        if (exceptionalPokemonIndex < 0) return null;

        return { no: `${891 + exceptionalPokemonIndex}`, name: exceptionalPokemons[exceptionalPokemonIndex] };
      };
    })();

    const $main = document.querySelector('#content > main > div > table.dextable > tbody > tr:nth-of-type(2)');
    return of($main).getPokemon();
  };
}
