import { getBrowserAndPage } from '@/utils';
import { Injectable } from '@nestjs/common';
import { EvolutionChain, initCrawlingUtils, Pokedex } from './crawling';
import { IPokemon } from './pokemon.interface';
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
}
