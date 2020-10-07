import { getBrowserAndPage, getJson, mergeJson } from '@/utils';
import { Injectable } from '@nestjs/common';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { EvolutionChain, initCrawlingUtils, Pokedex } from './crawling';
import { PokemonSimpleInfo } from './crawling/pokemonSimpleInfo';
import { PokemonWiki } from './crawling/pokemonWiki';
import { IEvolvingTo, IPokemon, IPokemonSimpleInfo } from './pokemon.interface';
import { EVOLUTION_TYPE } from './pokemon.type';

@Injectable()
export class PokemonService {
  public async getPokedex(): Promise<IPokemon[]> {
    const url = 'https://pokemondb.net/pokedex/all';
    const selector = '#pokedex > tbody > tr';
    const { browser, page } = await getBrowserAndPage(url, selector);
    await initCrawlingUtils(page);

    const { crawling, convertIntoKor } = new Pokedex();
    const pokemons = await page.$$eval(selector, crawling);
    await browser.close();

    return convertIntoKor(pokemons);
  }

  private async getEvolutionChains(type: EVOLUTION_TYPE): Promise<IPokemon[]> {
    const url = `https://pokemondb.net/evolution/${type}`;
    const selector = '#evolution > tbody > tr';
    const { browser, page } = await getBrowserAndPage(url, selector);
    await initCrawlingUtils(page);

    const { crawling, convertIntoKor } = new EvolutionChain(type);
    const evolutionChains = await page.$$eval(selector, crawling, type);
    await browser.close();

    return convertIntoKor(evolutionChains);
  }

  public getEvolutionChainByLevel(): Promise<IPokemon[]> {
    return this.getEvolutionChains(EVOLUTION_TYPE.LEVEL);
  }

  public async getEvolutionChainByElementalStone(): Promise<IPokemon[]> {
    return this.getEvolutionChains(EVOLUTION_TYPE.STONE);
  }

  public async getEvolutionChainByTrading(): Promise<IPokemon[]> {
    return this.getEvolutionChains(EVOLUTION_TYPE.TRADE);
  }

  public async getEvolutionChainByFriendship(): Promise<IPokemon[]> {
    return this.getEvolutionChains(EVOLUTION_TYPE.FRIENDSHIP);
  }

  public async getEvolutionChainByOtherCondition(): Promise<IPokemon[]> {
    return this.getEvolutionChains(EVOLUTION_TYPE.STATUS);
  }

  public async getPokemonWiki(): Promise<any> {
    const url = 'https://pokemon.fandom.com/ko/wiki/이상해씨';
    const selector = '.infobox-pokemon';
    const { browser, page } = await getBrowserAndPage(url, selector);
    const { crawling } = new PokemonWiki();

    const pokemons = await crawling(page);
    await browser.close();

    return pokemons;
  }

  public mergeEvolutionChains(): IPokemon[] {
    const dir = join(process.cwd(), 'src/assets/json');
    const fileNames = readdirSync(dir).filter(name => /^evolutionChainBy/gi.test(name));
    const mergedJson = mergeJson<IPokemon>({ fileNames })
      .flat()
      .reduce<IPokemon[]>((acc, pokemon, i, arr) => {
        const overlappingPokemons = arr.filter(({ name }) => name === pokemon.name);
        if (overlappingPokemons.length) {
          pokemon.evolvingTo = overlappingPokemons.map(({ evolvingTo }) => evolvingTo).flat();

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

  public mergePokedexAndEvolutionChains(): IPokemon[] {
    const dir = join(process.cwd(), 'src/assets/json');
    const fileName = `mergedEvolutionChains.json`;
    const isFile = existsSync(`${dir}/${fileName}`);
    if (!isFile) throw new Error(`${fileName} does not exist!`);

    const evolutionChains = getJson({ fileName }) as IPokemon[];
    const pokedex = getJson({ fileName: 'pokedex.json' }) as IPokemon[];

    const hasPokemon = (chain: IPokemon, name: string): boolean => {
      const isName = chain.name === name || chain.evolvingTo.some(p => hasPokemon(p, name));
      return isName;
    };

    return pokedex.reduce<IPokemon[]>((acc, pokemon) => {
      const evolvingTo = evolutionChains.filter(p => hasPokemon(p, pokemon.name)) as IEvolvingTo[];
      return [...acc, { ...pokemon, evolvingTo }];
    }, []);
  }

  public getPokemonSimpleInfo = async (): Promise<IPokemonSimpleInfo[]> => {
    const url = 'https://pokemondb.net/pokedex/bulbasaur';
    const selector = '#main';
    const { browser, page } = await getBrowserAndPage(url, selector);
    const { crawling } = new PokemonSimpleInfo();

    const pokemons = await crawling(page);
    await browser.close();

    return pokemons;
  };
}
