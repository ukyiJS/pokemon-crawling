import { LoadingBar, LoadingType, STDOUT } from '@/utils';
import { blueBright, redBright, yellowBright } from 'chalk';
import { Page } from 'puppeteer';
import { IEvolvingTo, IPokemon, IStats, IWindow } from '../pokemon.interface';

declare let window: IWindow;

type Loading = { update: (curser: number) => void };

export class CrawlingUtil {
  loadingBar: LoadingBar;

  loadingSize: number;

  protected getPrettyJson = <T>(json: T): string =>
    `${JSON.stringify(json)}`
      .replace(/("(?=n|e|i|t|s|c|a|h|f|w|g|r|d|v)(\w)+")/g, (_, m1) => m1.replace(/"/g, ''))
      .replace(/([:,{](?!\/))/g, '$1 ')
      .replace(/([}])/g, ' $1')
      .replace(/([[\]{}])/g, blueBright('$1'))
      .replace(/(\w+:(?!\/))/g, yellowBright('$1'))
      .replace(/(null)/g, redBright('$1'));

  protected initLoading = (size: number, type: LoadingType = STDOUT): void => {
    this.loadingSize = size;
    this.loadingBar = new LoadingBar(type);
  };

  protected get loading(): Loading {
    if (!this.loadingBar) throw redBright('loading has not been initialized.');
    return { update: (curser: number): void => this.loadingBar.update((curser / this.loadingSize) * 100) };
  }
}

export const initCrawlingUtils = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    window.getText = ($element: Element): string => $element.textContent!;
    window.getTexts = ($elements: NodeListOf<Element> | Element[]): string[] =>
      $elements.length ? Array.from($elements).map(({ textContent }) => textContent!) : [];

    window.getPokemonInfo = ($element: Element): IPokemon => {
      const stats = (($totalStat = $element.querySelector('.cell-total')): IStats[] | undefined => {
        if (!$totalStat) return undefined;

        const statNames = ['HP', '공격', '방어', '특수공격', '특수방어', '스피드'];
        const $stats = $element.querySelectorAll('.cell-num:not(.cell-fixed)');
        const stats = window.getTexts($stats).map<IStats>((value, i) => ({ name: statNames[i], value: +value }));
        const totalStat = { name: '총합', value: +window.getText($totalStat) };

        return [...stats, totalStat];
      })();

      const types = (($types = $element.querySelectorAll('.cell-icon a')): string[] | undefined => {
        return $types.length ? window.getTexts($types) : undefined;
      })();

      const noText = $element.querySelector('.infocard-cell-data')?.textContent ?? undefined;
      const no = Number(noText) ? noText : undefined;
      const name = $element.querySelector('.ent-name')!.textContent!;
      const $image = $element.querySelector('.icon-pkmn')!;
      const image = $image.getAttribute('data-src') ?? ($image as HTMLImageElement).src;
      const form = $element.querySelector('.text-muted')?.textContent ?? null;

      return { no, name, image, form, types, stats, differentForm: [], evolvingTo: [] };
    };

    window.getEvolvingTo = ($element: Element, to: IPokemon, type: string): IEvolvingTo => ({
      ...to,
      type,
      level: $element.querySelector('.cell-num')?.textContent || null,
      condition: $element.querySelector('.cell-med-text')?.textContent || null,
    });

    window.addFromEvolvingTo = (acc: IPokemon[], index: number, chain: IPokemon): IPokemon[] => {
      acc[index].evolvingTo = [chain] as IEvolvingTo[];
      return acc;
    };

    window.addMultipleEvolvingTo = (acc: IPokemon[], index: number, to: IEvolvingTo): IPokemon[] => {
      acc[index].evolvingTo = [...acc[index].evolvingTo, to];
      return acc;
    };
    window.addFromDifferentForm = (acc: IPokemon[], index: number, chain: IPokemon): IPokemon[] => {
      acc[index].differentForm = [...acc[index].differentForm, chain];
      return acc;
    };

    window.getStats = ($element: Element): IStats[] => {
      const totalStat = { name: '총합', value: +$element.querySelector('.cell-total')!.textContent! };
      const statNames = ['HP', '공격', '방어', '특수공격', '특수방어', '스피드'];
      const stats = Array.from($element.querySelectorAll('.cell-num:not(.cell-fixed)')).map((stat, i) => ({
        name: statNames[i],
        value: +stat.textContent!,
      }));
      return [...stats, totalStat];
    };
  });
};
