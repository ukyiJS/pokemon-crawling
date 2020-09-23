import { getBrowserAndPage, mergeJson } from '@/utils';
import { Injectable } from '@nestjs/common';
import { readdirSync } from 'fs';
import { join } from 'path';
import { IPokedex } from './common/type';
import { EvolutionType, getEvolutionChains } from './evolutionChains';
import { IEvolutionChain } from './pokemon.interface';

@Injectable()
export class PokemonService {
  public getEvolutionChainByLevel(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.LEVEL);
  }

  public getEvolutionChainByElementalStone(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.STONE);
  }

  public getEvolutionChainByTrading(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.TRADE);
  }

  public getEvolutionChainByFriendship(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.FRIENDSHIP);
  }

  public getEvolutionChainByOtherCondition(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.STATUS);
  }

  public getPokemonWithoutEvolutions(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.NONE);
  }

  public mergeEvolutionChains(): IEvolutionChain[] {
    const dir = join(process.cwd(), 'src/assets/json');
    const fileNames = readdirSync(dir).filter(name => /^evolutionChainBy/gi.test(name));
    const mergedJson = mergeJson<IEvolutionChain>({ fileNames })
      .flat()
      .reduce<IEvolutionChain[]>((acc, pokemon, i, arr) => {
        const hasPokemons = arr.filter(({ name }) => name === pokemon.name);
        if (hasPokemons.length > 1) {
          pokemon.evolvingTo = hasPokemons.map(({ evolvingTo }) => evolvingTo).flat();

          const uniqueNames = Array.from(new Set(pokemon.evolvingTo.map(({ name }) => name)));
          pokemon.evolvingTo = uniqueNames.map(name => ({ ...pokemon.evolvingTo.find(p => p.name === name)! }));
        }

        const preIndex = arr.findIndex(({ evolvingTo }) => evolvingTo.some(({ name }) => name === pokemon.name));
        if (preIndex > -1) {
          arr[preIndex].evolvingTo = arr[preIndex].evolvingTo.map(e => ({ ...e, evolvingTo: pokemon.evolvingTo }));
          return acc;
        }
        return [...acc, pokemon];
      }, []);

    const uniqueNames = Array.from(new Set(mergedJson.map(({ name }) => name)));
    return uniqueNames
      .map(name => ({ ...mergedJson.find(p => p.name === name && p.differentForm)! }))
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
  }

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
}
