import { Page } from 'puppeteer-extra/dist/puppeteer';
import { ISerebiiNet } from '../interfaces/serebiiNet.interface';
import { SerebiiNet } from '../model/serebiiNet.entity';

export class CrawlingPokemonIconImageOfSerebiiNet {
  public crawling = async (page: Page): Promise<ISerebiiNet[]> => {
    return page.evaluate((): SerebiiNet[] => {
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
        public getColumn = (): Element[][] => {
          return this.$elements.map(e => Array.from(e.querySelectorAll('td.fooinfo:nth-child(-n + 3)')));
        };
        public getSrc = (): string => this.$element?.querySelector('img')?.src ?? '';
        public getHref = (regExp?: RegExp): string => {
          const href = (<HTMLAnchorElement>this.$element)?.href;
          return (regExp ? href?.match(regExp)?.[1] : href) ?? '';
        };
      })();

      return of(document.querySelectorAll('#content > main > table > tbody > tr:nth-child(n + 3)'))
        .getColumn()
        .map(([$no, $image, $name]) => {
          const no = of($no).replaceText(/\D/);
          const image = of($image).getSrc();
          const name = { eng: of($name).getText(), kor: '' };
          return { no, name, image };
        });
    });
  };
}
