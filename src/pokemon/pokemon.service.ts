import { DataToDownload, DownloadImage, getJson, PuppeteerUtil } from '@/utils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { PokemonsOfDatabase } from './crawling/pokemonDatabase/pokemons';
import { PokemonsOfWiki } from './crawling/pokemonWiki/pokemons';
import { PokemonIconImages } from './crawling/serebiiNet/pokemonIconImages';
import { PokemonImages } from './crawling/serebiiNet/pokemonImages';
import { PokemonOfDatabase } from './model/pokemonOfDatabase.entity';
import { IPokemonImage, IPokemonOfDatabase, IPokemonsOfWiki } from './pokemon.interface';

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

  public async getPokemonsOfDatabase(): Promise<IPokemonOfDatabase[]> {
    const url = 'https://pokemondb.net/pokedex/bulbasaur';
    const selector = '#main';
    const { getBrowserAndPage } = new PuppeteerUtil();
    const { browser, page } = await getBrowserAndPage(url, selector);
    const { crawling } = new PokemonsOfDatabase(page);

    const pokemons = await crawling();
    await browser.close();

    return pokemons;
  }

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
      pokemonIconImages.map(p => ({
        url: p.image,
        fileName: `${p.no}.png`,
      })),
    );

    return pokemonIconImages;
  }

  public async getPokemonImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    let pokemonImages = getJson<IPokemonImage[]>({ fileName: 'pokemonImagesOfSerebiiNet.json' });

    if (!pokemonImages) {
      const url = 'https://serebii.net/pokemon/bulbasaur';
      const selector = '#content > main';
      const { getBrowserAndPage } = new PuppeteerUtil();
      const { browser, page } = await getBrowserAndPage(url, selector);
      const { crawling } = new PokemonImages(page);

      pokemonImages = await crawling();
      await browser.close();
    }

    const imagesToDownload = pokemonImages.reduce<DataToDownload[]>((acc, p) => {
      const extension = 'png';

      const downloadData = { url: p.image, fileName: `${p.no}.${extension}` };
      if (!p.differentForm?.length) return [...acc, downloadData];

      const differentForm = p.differentForm.map(d => ({
        url: d.image,
        fileName: `${p.no}-${d.form}.${extension}`,
      }));
      return [...acc, downloadData, ...differentForm];
    }, []);

    const { multipleDownloads } = new DownloadImage();
    await multipleDownloads(imagesToDownload);

    return pokemonImages;
  }
}
