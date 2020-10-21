import { getBrowserAndPage } from '@/utils';
import { Injectable } from '@nestjs/common';
import { Evolution, PokemonsOfDatabase, PokemonsOfWiki } from './crawling';
import { IEvolution, IPokemonsOfDatabase, IPokemonsOfWiki } from './pokemon.interface';
import { EVOLUTION_TYPE } from './pokemon.type';

@Injectable()
export class PokemonService {
  public async getPokemonsOfWiki(): Promise<IPokemonsOfWiki[]> {
    const url = 'https://pokemon.fandom.com/ko/wiki/이상해씨';
    const selector = '.infobox-pokemon';
    const { browser, page } = await getBrowserAndPage(url, selector);
    const { crawling } = new PokemonsOfWiki(page);

    const pokemons = await crawling();
    await browser.close();

    return pokemons;
  }

  public getPokemonsOfDatabase = async (): Promise<IPokemonsOfDatabase[]> => {
    const url = 'https://pokemondb.net/pokedex/bulbasaur';
    const selector = '#main';
    const { browser, page } = await getBrowserAndPage(url, selector);
    const { crawling } = new PokemonsOfDatabase(page);

    const pokemons = await crawling();
    await browser.close();

    return pokemons;
  };

  public getEvolutionOfDatabase = async (): Promise<IEvolution[]> => {
    const url = (type: EVOLUTION_TYPE) => `https://pokemondb.net/evolution/${type}`;
    const selector = '#evolution > tbody > tr';
    const browserAndPages = Object.values(EVOLUTION_TYPE).map(type => getBrowserAndPage(url(type), selector));

    let evolutions: IEvolution[][] = [];
    for (const { browser, page } of await Promise.all(browserAndPages)) {
      const [evolutionType] = page.url().match(/(?<=\/)(\w+)$/)! as [EVOLUTION_TYPE];

      const { crawling } = new Evolution(page, evolutionType);
      const pokemons = await crawling();
      evolutions = [...evolutions, pokemons];

      await browser.close();
    }

    return evolutions.flat();
  };
}
