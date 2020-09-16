import { IWindow } from '@/utils';
import { Page } from 'puppeteer';
import { IEvolutionChain, EvolutionType, CrawlingEvolution } from './types';
import { convertEngToKor, evolutionUtil } from './utils';

declare let window: IWindow;

export const getEvolutionChainByLevel = async (page: Page): Promise<IEvolutionChain[]> => {
  await evolutionUtil(page);

  const crawling: CrawlingEvolution = (elements, type) =>
    elements.reduce((acc, $tr) => {
      const [from, to] = window.getPokemons($tr.querySelectorAll('.cell-name'));
      const level = $tr.querySelector('.cell-num')!.textContent!;
      const condition = $tr.querySelector('.cell-med-text')?.textContent ?? '';
      const evolutionTo = { ...to, type, condition: [level, condition] };

      const isDuplicatePokemon = acc.some(p => p.name === from.name && !from.differentForm);
      if (isDuplicatePokemon) return window.addEvolutionFrom(acc, from, evolutionTo);

      return [...acc, { ...from, evolutionTo: [evolutionTo] }];
    }, [] as IEvolutionChain[]);
  const type = EvolutionType.LEVEL;
  const crawlingData = await page.$$eval('#evolution > tbody > tr', crawling, type);

  return convertEngToKor(type, crawlingData);
};
