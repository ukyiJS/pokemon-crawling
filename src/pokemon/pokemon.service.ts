import { DownloadImage, EvolutionUtil, getJson, PuppeteerUtil } from '@/utils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Evolution, PokemonsOfDatabase, PokemonsOfWiki } from './crawling';
import { PokemonIconImages } from './crawling/serebiiNet/pokemonIconImages';
import { PokemonOfDatabase } from './model/pokemonOfDatabase.entity';
import { IEvolution, IPokemonImage, IPokemonOfDatabase, IPokemonsOfWiki } from './pokemon.interface';
import { evolutionType, EvolutionType } from './pokemon.type';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(PokemonOfDatabase)
    private readonly pokemonOfDatabaseRepository: MongoRepository<PokemonOfDatabase>,
  ) {}

  public async getPokemonsOfWiki(): Promise<IPokemonsOfWiki[]> {
    const url = 'https://pokemon.fandom.com/ko/wiki/이상해씨';
    const selector = '.infobox-pokemon';
    const { getBrowserAndPage } = new PuppeteerUtil();
    const { page, browser } = await getBrowserAndPage(url, selector);
    const { crawling } = new PokemonsOfWiki(page);

    const pokemons = await crawling();
    await browser.close();

    return pokemons;
  }

  public getPokemonsOfDatabase = async (): Promise<IPokemonOfDatabase[]> => {
    const url = 'https://pokemondb.net/pokedex/bulbasaur';
    const selector = '#main';
    const { getBrowserAndPage } = new PuppeteerUtil();
    const { browser, page } = await getBrowserAndPage(url, selector);
    const { crawling } = new PokemonsOfDatabase(page);

    const pokemons = await crawling();
    await browser.close();

    return pokemons;
  };

  public getEvolutionOfDatabase = async (): Promise<IEvolution[]> => {
    const url = (type: EvolutionType) => `https://pokemondb.net/evolution/${type}`;
    const selector = '#evolution';
    const { addTwiceEvolution, addMoreThanTwoKindsEvolution, addDifferentForm } = new EvolutionUtil();

    let evolutions: IEvolution[] = [];
    for (const type of Object.values(evolutionType)) {
      const { getBrowserAndPage } = new PuppeteerUtil();
      const { browser, page } = await getBrowserAndPage(url(type), selector);
      const [match] = page.url().match(/(?<=\/)\w+$/) ?? [];
      if (!match) return [];

      const { crawling } = new Evolution(page, match as EvolutionType);
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

  public async findPokemonOfDatabases(page = 1, display = 10): Promise<PokemonOfDatabase[]> {
    return this.pokemonOfDatabaseRepository.find({
      skip: (page - 1) * display,
      take: display,
      order: { no: 'ASC' },
      cache: true,
    });
  }

  public async addPokemonOfDatabases(): Promise<boolean> {
    const pokemons = getJson<PokemonOfDatabase[]>({ fileName: 'pokemonsOfDatabase.json' });
    if (!pokemons) return false;
    try {
      await Promise.all(pokemons.map(pokemon => this.pokemonOfDatabaseRepository.save(new PokemonOfDatabase(pokemon))));
    } catch (error) {
      Logger.error(error.message, undefined, error);
      throw error;
    }
    return true;
  }

  public async getPokemonIconImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    let pokemonIconImages = getJson<IPokemonImage[]>({ fileName: 'pokemonIconImagesOfSerebiiNet.json' });

    if (!pokemonIconImages) {
      const url = 'https://serebii.net/pokemon/nationalpokedex.shtml';
      const selector = '#content > main';
      const { getBrowserAndPage } = new PuppeteerUtil();
      const { browser, page } = await getBrowserAndPage(url, selector);
      const { crawling } = new PokemonIconImages(page);

      pokemonIconImages = await crawling();
      await browser.close();
    }

    const { multipleDownloads } = new DownloadImage();
    await multipleDownloads(
      [...pokemonIconImages.slice(0, 10)].map(p => ({
        url: p.image,
        fileName: `${p.no}.png`,
      })),
    );

    return pokemonIconImages;
  }
}
