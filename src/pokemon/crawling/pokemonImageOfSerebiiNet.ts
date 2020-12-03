import { CrawlingUtil, ProgressBar } from '@/utils';
import { Logger } from '@nestjs/common';
import { Page } from 'puppeteer-extra/dist/puppeteer';
import { ISerebiiNet } from '../interfaces/serebiiNet.interface';
import { SerebiiNet } from '../model/serebiiNet.entity';
import { LanguageType } from '../types/language.type';
import { SerebiiNetType } from '../types/serebiiNet.type';

type Column = [Element, Element[], Element, Element[], SerebiiNetType[], SerebiiNetType[]];
type ImageAndForm = Omit<Omit<ISerebiiNet, 'no'>, 'name'>;

export class CrawlingPokemonImageOfSerebiiNet extends CrawlingUtil {
  public crawling = async (page: Page): Promise<ISerebiiNet[]> => {
    let curser = 0;
    const loopCount = 893;
    const { updateProgressBar } = new ProgressBar(loopCount);

    let pokemons = <SerebiiNet[]>[];
    const nextClickSelector = 'main > table:last-child > tbody > tr > td:last-child a';

    while (true) {
      await page.waitForSelector('#content > main > div > table.dextable > tbody > tr');

      const pokemon = await page.evaluate(this.getPokemonOfSerebiiNet);
      pokemons = [...pokemons, pokemon];

      curser = +pokemon.no;
      Logger.log(`${pokemon.no} : ${pokemon.name.kor}`, 'Result');
      updateProgressBar((curser / loopCount) * 100);

      if (curser >= loopCount) break;
      await this.onPageClick(page, nextClickSelector);
    }

    return this.getUniqueObjectArray(pokemons, 'no');
  };

  private getPokemonOfSerebiiNet = (): ISerebiiNet => {
    const { of, getExceptionalPokemon } = new (class {
      private $element: Element | Element[] | null;

      public of = <T>($element: T): this => {
        if (!$element) this.$element = null;
        else this.$element = $element instanceof Element ? $element : Array.from(<T & NodeListOf<Element>>$element);

        return this;
      };
      public getColumn = (): Column => {
        const [$image, _$name, _$no] = this.getChildren().filter((_, i) => i < 3);
        const $no = _$no.querySelector('tr > td:last-child')!;
        const $name = of(_$name.querySelectorAll('tr:nth-child(4n + 1) > td:last-child')).getElements();
        const $table = of(document.querySelectorAll('#content > main > table.dextable')).getElements();

        const $differentFormTable = $table.find(e => /^alternate/gi.test(e.querySelector('td')?.textContent ?? ''));
        const $megaEvolutionTable = $table.find(e => /^mega/gi.test(e.querySelector('td')?.textContent ?? ''));
        const $gigantamaxTable = $table.find(e => /^gigantamax/gi.test(e.querySelector('td')?.textContent ?? ''));

        const $differentForms = of($differentFormTable).getDifferentFormElements();
        const $megaEvolution = <SerebiiNetType[]>of($megaEvolutionTable).getDifferentEvolution();
        const $gigantamax = <SerebiiNetType[]>of($gigantamaxTable).getDifferentEvolution();

        return [$no, $name, $image, $differentForms, $megaEvolution, $gigantamax];
      };
      public getElement = (): Element | null => <Element | null>this.$element;
      public getElements = (): Element[] => <Element[]>this.$element;
      public getText = (): string => (<Element | null>this.$element)?.textContent?.trim().replace(/é/gi, 'e') ?? '';
      public getTexts = (): string[] => {
        return this.getElements().reduce<string[]>((acc, $element) => {
          const text = $element.textContent?.trim().replace(/é/gi, 'e') ?? '';
          return text ? [...acc, text] : acc;
        }, []);
      };
      public replaceText = (searchValue: string | RegExp, replaceValue = ''): string => {
        return this.getText().replace(new RegExp(searchValue, 'gi'), replaceValue);
      };
      private getChildren = () => Array.from(this.getElement()?.children ?? []);
      private getImageAndForm = (): ImageAndForm | null => {
        const $image = this.getElement()?.querySelector('img');
        if (!$image) return null;

        const { src: image, alt } = <HTMLImageElement>$image;
        const form = (() => {
          const camelCaseForm = `${alt.substr(0, 1).toLowerCase()}${alt.substr(1, alt.length)}`;
          const form = camelCaseForm
            .replace(/unovan form|unovan|artwork|[^a-z]/gi, '')
            .replace(/galarianform/gi, 'galar')
            .replace(/alolaform/gi, 'alola');
          return form;
        })();
        return { image, form };
      };
      private getImageAndForms = (): ImageAndForm[] => {
        return this.getElements().reduce<ImageAndForm[]>((acc, $element) => {
          const images = of($element).getImageAndForm();
          return images ? [...acc, images] : acc;
        }, []);
      };
      private getDifferentFormElements = (): Element[] => {
        const $differentForm = this.getElement();
        if (!$differentForm) return [];

        return Array.from($differentForm.querySelectorAll('tr:last-child tr:nth-child(2) > td'));
      };
      private getDifferentEvolution = (): ImageAndForm[] => {
        const $differentEvolution = this.getElement();
        if (!$differentEvolution) return [];

        return Array.from($differentEvolution.querySelectorAll('td > img')).map($element => {
          const { src: image, alt } = <HTMLImageElement>$element;
          const form = (() => {
            const camelCaseForm = `${alt.substr(0, 1).toLowerCase()}${alt.substr(1, alt.length)}`;
            const form = camelCaseForm.replace(/unovan form|unovan|artwork|[^a-z]/gi, '');
            if (/^gigantamax/gi.test(form)) return 'dynamax';
            if (/^mega.*x$/gi.test(form)) return 'megaX';
            if (/^mega.*y$/gi.test(form)) return 'megaY';
            if (/^mega/gi.test(form)) return 'mega';
            return form;
          })();
          return { image, form };
        });
      };
      public getSrc = (): string => this.getElement()?.querySelector('img')?.src ?? '';
      public getHref = (regExp?: RegExp): string => {
        const href = (<HTMLAnchorElement>this.getElement())?.href;
        return (regExp ? href?.match(regExp)?.[1] : href) ?? '';
      };
      public getDifferentForm = (): ISerebiiNet => {
        const [$differentForm, ...$differentForms] = this.getElements();
        const { image, form } = of($differentForm).getImageAndForm()!;

        const differentForm = of($differentForms).getImageAndForms();

        const pokemon = <ISerebiiNet>{ image, form, differentForm };

        if (/^originalcap/gi.test(form ?? '')) {
          const basicImage = document.querySelector<HTMLImageElement>('#sprite-regular')?.src ?? '';
          return {
            ...pokemon,
            image: basicImage,
            form: null,
            differentForm: <SerebiiNetType[]>[...differentForm, { image, form }],
          };
        }

        return pokemon;
      };
      public getExceptionalPokemon = (eng: string): { no: string; name: LanguageType } | null => {
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

    const [$no, $name, $image, $differentForm, $megaEvolution, $dynamax] = of(
      document.querySelector('#content > main > div > table.dextable > tbody > tr:nth-of-type(2)'),
    ).getColumn();

    const [eng, kor] = of($name).getTexts();
    const no = of($no).replaceText(/#/);
    const pokemon = { no, name: { eng, kor } };
    const megaEvolution = $megaEvolution.map(mega => ({ ...pokemon, ...mega }));
    const dynamax = $dynamax.map(dynamax => ({ ...pokemon, ...dynamax }));

    let pokemons = <Required<ISerebiiNet>>{
      ...pokemon,
      image: of($image).getSrc(),
      form: null,
      differentForm: megaEvolution.concat(dynamax),
    };

    const exceptionalPokemon = getExceptionalPokemon(eng);
    if (exceptionalPokemon) pokemons = { ...pokemons, ...exceptionalPokemon };

    if ($differentForm.length) {
      const { image, form, differentForm: _differentForm } = of($differentForm).getDifferentForm();
      const differentForm = pokemons.differentForm.concat(_differentForm!.map(d => ({ ...pokemon, ...d })));
      return { ...pokemons, image, form, differentForm };
    }
    return pokemons;
  };
}
