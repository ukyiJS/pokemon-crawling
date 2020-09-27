import { Page } from 'puppeteer';
import { IEvolutionChain, IEvolvingTo, IWindow } from '../pokemon.interface';

declare let window: IWindow;

export const initCrawlingUtils = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    window.getPokemonInfo = ($element: Element): IEvolutionChain => {
      const $image = $element.querySelector('.icon-pkmn')!;

      const name = $element.querySelector('.ent-name')!.textContent!;
      const image = $image.getAttribute('data-src') ?? ($image as HTMLImageElement).src;
      const form = $element.querySelector('.text-muted')?.textContent ?? null;

      return { name, image, form, differentForm: [], evolvingTo: [] };
    };

    window.getEvolvingTo = ($element: Element, to: IEvolutionChain, type: string): IEvolvingTo => ({
      ...to,
      type,
      level: $element.querySelector('.cell-num')?.textContent ?? null,
      condition: $element.querySelector('.cell-med-text')?.textContent || null,
    });

    window.addFromEvolvingTo = (acc: IEvolutionChain[], index: number, chain: IEvolutionChain): IEvolutionChain[] => {
      acc[index].evolvingTo = [chain] as IEvolvingTo[];
      return acc;
    };

    window.addMultipleEvolvingTo = (acc: IEvolutionChain[], index: number, to: IEvolvingTo): IEvolutionChain[] => {
      acc[index].evolvingTo = [...acc[index].evolvingTo, to];
      return acc;
    };

    window.addFromDifferentForm = (
      acc: IEvolutionChain[],
      index: number,
      chain: IEvolutionChain,
    ): IEvolutionChain[] => {
      acc[index].differentForm = [...acc[index].differentForm, chain] as IEvolutionChain[];
      return acc;
    };
  });
};
