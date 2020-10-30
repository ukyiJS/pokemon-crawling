import { getBrowserAndPage } from '@/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Evolution, PokemonsOfDatabase, PokemonsOfWiki } from './crawling';
import { CrawlingUtil } from './crawling/utils';
import { PokemonOfDatabase } from './model/pokemonOfDatabase.entity';
import { IEvolution, IPokemonOfDatabase, IPokemonsOfWiki } from './pokemon.interface';
import { EVOLUTION_TYPE } from './pokemon.type';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(PokemonOfDatabase)
    private readonly pokemonOfDatabaseRepository: MongoRepository<PokemonOfDatabase>,
  ) {}

  public async getPokemonsOfWiki(): Promise<IPokemonsOfWiki[]> {
    const url = 'https://pokemon.fandom.com/ko/wiki/이상해씨';
    const selector = '.infobox-pokemon';
    const { browser, page } = await getBrowserAndPage(url, selector);
    const { crawling } = new PokemonsOfWiki(page);

    const pokemons = await crawling();
    await browser.close();

    return pokemons;
  }

  public getPokemonsOfDatabase = async (): Promise<IPokemonOfDatabase[]> => {
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
    const selector = '#evolution';
    const { addTwiceEvolution, addMoreThanTwoKindsEvolution, addDifferentForm } = new CrawlingUtil();

    let evolutions: IEvolution[] = [];
    for (const type of Object.values(EVOLUTION_TYPE)) {
      if (type === EVOLUTION_TYPE.NONE) continue;

      const { browser, page } = await getBrowserAndPage(url(type), selector);
      const [match] = page.url().match(/(?<=\/)\w+$/) ?? [];
      if (!match) return [];

      const evolutionType = match as EVOLUTION_TYPE;
      const { crawling } = new Evolution(page, evolutionType);
      const pokemons = await crawling();

      evolutions = [...evolutions, ...pokemons];

      await browser.close();
    }

    return evolutions
      .reduce<IEvolution[]>((acc, evolution) => {
        if (addTwiceEvolution(acc, evolution)) return acc;
        if (addMoreThanTwoKindsEvolution(acc, evolution)) return acc;
        if (addDifferentForm(acc, evolution)) return acc;

        return [...acc, evolution];
      }, [])
      .sort((a, b) => +a.no - +b.no);
  };

  public async findPokemonOfDatabases(search?: { page?: number; display?: number }): Promise<PokemonOfDatabase[]> {
    const page = search?.page ?? 1;
    const display = search?.display ?? 10;

    return this.pokemonOfDatabaseRepository.find({
      skip: (page - 1) * display,
      take: display,
      order: { no: 'ASC' },
      cache: true,
    });
  }
}
