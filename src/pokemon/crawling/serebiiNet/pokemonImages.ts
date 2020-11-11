import { IDifferentFormImage, IPokemonImage } from '@/pokemon/pokemon.interface';
import { CrawlingUtil, ProgressBar } from '@/utils';
import { Logger } from '@nestjs/common';

export class PokemonImages extends CrawlingUtil {
  protected promiseLocalStorage: Promise<void>;

  public crawling = async (): Promise<IPokemonImage[]> => {
    let curser = 0;
    const numberOfLoop = 897;
    const progressBar = new ProgressBar();

    let pokemonImages = <IPokemonImage[]>[];
    const nextClickSelector = 'main > table:last-child > tbody > tr > td:last-child a';

    while (true) {
      await this.page.waitForSelector('#content > main > div > table.dextable > tbody > tr');

      const pokemonImage = await this.page.evaluate(this.getPokemonImages);
      pokemonImages = [...pokemonImages, pokemonImage];

      curser = +pokemonImage.no;
      Logger.log(`${pokemonImage.no} : ${pokemonImage.name}`, 'Result');
      progressBar.update((curser / numberOfLoop) * 100);

      if (curser >= numberOfLoop) break;

      try {
        await this.page.waitForSelector(nextClickSelector, { visible: true });
      } catch (error) {
        Logger.error(error.message, undefined, 'TimeoutError');
        break;
      }
      await Promise.all([this.page.click(nextClickSelector), this.page.waitForNavigation()]);
    }

    return pokemonImages;
  };

  private getPokemonImages = (): IPokemonImage => {
    const { of, getExceptionalPokemon } = new (class {
      private $element: Element | Element[] | null;

      public of = <T>($element: T): this => {
        if (!$element) this.$element = null;
        else this.$element = $element instanceof Element ? $element : Array.from(<T & NodeListOf<Element>>$element);

        return this;
      };
      public getColumn = (): [Element, Element[], Element, Element[] | null] => {
        const [$image, _$name, _$no] = this.getChildren().filter((_, i) => i < 3);
        const $no = _$no.querySelector('tr > td:last-child')!;
        const $name = of(_$name.querySelectorAll('tr:nth-child(4n + 1) > td:last-child')).getElements();
        const $table = of(document.querySelectorAll('#content > main > table.dextable'))
          .getElements()
          .find(e => /Alternate Forms/gi.test(e.querySelector('td')?.textContent ?? ''));
        const $differentForms = $table
          ? of($table.querySelectorAll('tr:last-child tr:nth-child(2) > td')).getElements()
          : null;

        return [$no, $name, $image, $differentForms];
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
      public getChildren = () => Array.from(this.getElement()?.children ?? []);
      public matchText = (regExp: RegExp): string => this.getText().match(regExp)?.[1] ?? '';
      public replaceText = (searchValue: string | RegExp, replaceValue = ''): string => {
        return this.getText().replace(new RegExp(searchValue, 'gi'), replaceValue);
      };
      public getImageElement = (): IDifferentFormImage | null => {
        const $image = this.getElement()?.querySelector('img');
        const regExp = /unovan form|unovan|\s/gi;
        return $image ? { image: $image.src, form: $image.alt.replace(regExp, '') } : null;
      };
      public getSrc = (): string => this.getElement()?.querySelector('img')?.src ?? '';
      public getHref = (regExp?: RegExp): string => {
        const href = (<HTMLAnchorElement>this.getElement())?.href;
        return (regExp ? href?.match(regExp)?.[1] : href) ?? '';
      };
      public getDifferentForm = (): Partial<IPokemonImage> => {
        const [$differentForm, ...$differentForms] = this.getElements();
        const { image, form } = of($differentForm).getImageElement()!;
        const differentForm = $differentForms.map($element => ({ ...of($element).getImageElement()! }));

        if (/^original cap/gi.test(form)) {
          const basicImage = document.querySelector<HTMLImageElement>('#sprite-regular')?.src ?? '';
          return { image: basicImage, form: null, differentForm: [{ image, form }, ...differentForm] };
        }

        return { image, form, differentForm };
      };
      public getExceptionalPokemon = (engName: string): { no: string; name: string } | null => {
        const exceptionalPokemons = [
          { engName: 'Kubfu', korName: '치고마' },
          { engName: 'Urshifu', korName: '우라오스' },
          { engName: 'Zarude', korName: '자루도' },
          { engName: 'Regieleki', korName: '레지에레키' },
          { engName: 'Regidrago', korName: '레지드래고' },
          { engName: 'Glastrier', korName: '블리자포스' },
          { engName: 'Spectrier', korName: '레이스포스' },
        ];

        const exceptionalPokemonIndex = exceptionalPokemons.findIndex(p => p.engName === engName);
        if (exceptionalPokemonIndex < 0) return null;

        return { no: `${891 + exceptionalPokemonIndex}`, name: exceptionalPokemons[exceptionalPokemonIndex].korName };
      };
    })();

    const [$no, $name, $image, $differentForm] = of(
      document.querySelector('#content > main > div > table.dextable > tbody > tr:nth-of-type(2)'),
    ).getColumn();

    const [engName, korName] = of($name).getTexts();
    const no = of($no).replaceText(/#/);
    let pokemonImages = { no, name: korName, engName, image: of($image).getSrc(), form: null };

    const exceptionalPokemon = getExceptionalPokemon(engName);
    if (exceptionalPokemon) pokemonImages = { ...pokemonImages, ...exceptionalPokemon };

    if ($differentForm) return { ...pokemonImages, ...of($differentForm).getDifferentForm() };
    return pokemonImages;
  };
}
