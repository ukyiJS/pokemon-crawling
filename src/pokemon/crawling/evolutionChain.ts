import { Page } from 'puppeteer';
import { EvolutionType } from '../pokemon.enum';
import { IEvolutionChain, IEvolvingTo, IWindow } from '../pokemon.interface';
import { PokemonForm } from './pokemonForm';

declare let window: IWindow;

export class EvolutionChain {
  page: Page;

  evolutionType: EvolutionType;

  constructor(page: Page, evolutionType: EvolutionType) {
    this.page = page;
    this.evolutionType = evolutionType;

    this.initCrawlingUtils();
  }

  private async initCrawlingUtils(): Promise<void> {
    await this.page.evaluate(() => {
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
  }

  public crawling($elements: Element[], type: string): IEvolutionChain[] {
    return $elements.reduce<IEvolutionChain[]>((acc, $tr) => {
      const $cellNames = Array.from($tr.querySelectorAll('.cell-name'));
      const [from, to] = $cellNames.map(window.getPokemonInfo);
      const evolvingTo = window.getEvolvingTo($tr, to, type);
      const chain = { ...from, evolvingTo: [evolvingTo] };

      const fromEvolvingToIndex = acc.findIndex(p => p.evolvingTo.some(_p => _p.name === from.name));
      if (fromEvolvingToIndex > -1) return window.addFromEvolvingTo(acc, fromEvolvingToIndex, chain);

      const fromNameIndex = acc.findIndex(pokemon => pokemon.name === from.name);
      if (fromNameIndex > -1) {
        if (from.form) return window.addFromDifferentForm(acc, fromNameIndex, chain);
        return window.addMultipleEvolvingTo(acc, fromNameIndex, evolvingTo);
      }

      return [...acc, chain] as IEvolutionChain[];
    }, []);
  }

  public convertIntoKor(evolutionChains: IEvolutionChain[]): IEvolutionChain[] {
    const { convertFormIntoKor } = new PokemonForm(this.evolutionType);
    return evolutionChains.map(convertFormIntoKor);
  }
}
