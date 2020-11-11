import { IPokemonImage } from '@/pokemon/pokemon.interface';
import { PokemonName, pokemonName } from '@/pokemon/pokemon.type';
import { CrawlingUtil, FunctionString, functionString } from '@/utils';

const { getName } = functionString;

export class PokemonIconImages extends CrawlingUtil {
  protected promiseLocalStorage = this.initLocalStorage([{ functionString: { getName } }, { pokemonName }]);

  public crawling = async (): Promise<IPokemonImage[]> => {
    await this.promiseLocalStorage;

    return this.page.evaluate((): IPokemonImage[] => {
      const { of } = new (class {
        private functionString: FunctionString;
        private type: { pokemonName: PokemonName };
        private $element: Element | null;
        private $elements: Element[];

        constructor() {
          this.functionString = this.getItem<FunctionString>('functionString');
          this.type = { pokemonName: this.getItem<PokemonName>('pokemonName') };
        }

        public of = ($element: Element | Element[] | NodeListOf<Element> | null): this => {
          if (!$element) this.$element = null;
          else if ($element instanceof Element) this.$element = $element;
          else this.$elements = Array.from($element);

          return this;
        };
        private parseFunction = (funcString: string) => {
          const funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gim;
          const match = funcReg.exec(funcString.replace(/\n/g, ' '));
          if (!match) return null;

          const [, func, ...funcs] = match;
          return new Function(...func.split(',').concat(funcs));
        };
        public getColumn = (): Element[][] => {
          return this.$elements.map(e => Array.from(e.querySelectorAll('td.fooinfo:nth-child(-n + 3)')));
        };
        public getItem = <T>(key: string): T => JSON.parse(localStorage.getItem(key) ?? '{}');
        public getElement = (): Element | null => this.$element;
        public getElements = (): Element[] => this.$elements;
        public getText = (): string => (<Element | null>this.$element)?.textContent?.trim().replace(/é/gi, 'e') ?? '';
        public getTexts = (): string[] => {
          return this.$elements.reduce<string[]>((acc, $element) => {
            const text = $element.textContent?.trim().replace(/é/gi, 'e') ?? '';
            return text ? [...acc, text] : acc;
          }, []);
        };
        public matchText = (regExp: RegExp): string => this.getText().match(regExp)?.[1] ?? '';
        public replaceText = (searchValue: string | RegExp, replaceValue = ''): string => {
          return this.getText().replace(new RegExp(searchValue, 'gi'), replaceValue);
        };
        public getSrc = (): string => this.$element?.querySelector('img')?.src ?? '';
        public getHref = (regExp?: RegExp): string => {
          const href = (<HTMLAnchorElement>this.$element)?.href;
          return (regExp ? href?.match(regExp)?.[1] : href) ?? '';
        };
        public getName = (): PokemonName => {
          return this.parseFunction(this.functionString.getName)?.call(null, this.getText(), this.type.pokemonName);
        };
      })();

      return of(document.querySelectorAll('#content > main > table > tbody > tr:nth-child(n + 3)'))
        .getColumn()
        .map(([$no, $image, $name]) => {
          const no = of($no).replaceText(/\D/);
          const image = of($image).getSrc();
          const name = of($name).getName();
          const engName = of($name).getText();
          return { no, name, engName, image };
        });
    });
  };
}
