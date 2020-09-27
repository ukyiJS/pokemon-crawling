import { getBrowserAndPage } from '@/utils';
import { Injectable } from '@nestjs/common';
import { EvolutionChain } from './crawling';
import { IPokedex } from './pokedex/type';
import { IEvolutionChain } from './pokemon.interface';
import { EvolutionType } from './pokemon.type';

@Injectable()
export class PokemonService {
  public async getPokedex(): Promise<IPokedex[]> {
    const url = 'https://pokemondb.net/pokedex/all';
    const waitForSelector = '#pokedex > tbody';
    const { browser, page } = await getBrowserAndPage(url, waitForSelector);

    const crawlingData = await page.$$eval('#pokedex > tbody > tr', el => {
      return Array.from(el).reduce<IPokedex[]>((acc, $tr) => {
        const no = $tr.querySelector('.infocard-cell-data')!.textContent!;
        const $image = $tr.querySelector('.icon-pkmn')!;
        const image = $image.getAttribute('data-src') ?? ($image as HTMLImageElement).src;
        const name = $tr.querySelector('.ent-name')!.textContent;
        const form = $tr.querySelector('.text-muted')?.textContent ?? null;
        const index = acc.findIndex(pokemon => pokemon.no === no);
        const isOverlapPokemon = index > -1 && !form;

        if (/partner/i.test(form ?? '') || isOverlapPokemon) return acc;

        const types = Array.from($tr.querySelectorAll('.cell-icon a')).map(a => a.textContent);
        const totalStat = { name: '총합', value: $tr.querySelector('.cell-total')!.textContent };
        const statNames = ['HP', '공격', '방어', '특수공격', '특수방어', '스피드'];
        const stats = Array.from($tr.querySelectorAll('.cell-num:not(.cell-fixed)')).map((stat, i) => ({
          name: statNames[i],
          value: +stat.textContent!,
        }));
        const result = { no, name, image, form, types, stats: [...stats, totalStat] };

        if (index > -1) {
          acc[index].differentForm = [...acc[index].differentForm, result] as IPokedex[];
          return acc;
        }

        return [...acc, { ...result, differentForm: [] }] as IPokedex[];
      }, []);
    });
    await browser.close();
    return crawlingData;
  }

  private async getEvolutionChains(type: EvolutionType): Promise<IEvolutionChain[]> {
    const url = `https://pokemondb.net/evolution/${type}`;
    const selector = '#evolution > tbody > tr';
    const { browser, page } = await getBrowserAndPage(url, selector);
    const { crawling, convertIntoKor } = new EvolutionChain(page, type);

    const evolutionChains = await page.$$eval(selector, crawling, type);
    await browser.close();

    return convertIntoKor(evolutionChains);
  }

  public getEvolutionChainByLevel(): Promise<IEvolutionChain[]> {
    return this.getEvolutionChains(EvolutionType.LEVEL);
  }

  public async getEvolutionChainByElementalStone(): Promise<IEvolutionChain[]> {
    return this.getEvolutionChains(EvolutionType.STONE);
  }

  public async getEvolutionChainByTrading(): Promise<IEvolutionChain[]> {
    return this.getEvolutionChains(EvolutionType.TRADE);
  }

  public async getEvolutionChainByFriendship(): Promise<IEvolutionChain[]> {
    return this.getEvolutionChains(EvolutionType.FRIENDSHIP);
  }

  public async getEvolutionChainByOtherCondition(): Promise<IEvolutionChain[]> {
    return this.getEvolutionChains(EvolutionType.STATUS);
  }
}
