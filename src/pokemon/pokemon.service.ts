import {
  DataToDownload,
  DownloadImage,
  getGenerationName,
  getJson,
  ProgressBar,
  PuppeteerUtil,
  setDifferentFormImage,
  setImage,
} from '@/utils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAndModifyWriteOpResultObject, MongoRepository } from 'typeorm';
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

  public async findPokemonOfDatabase(page = 1, display = 10): Promise<PokemonOfDatabase[]> {
    return this.pokemonOfDatabaseRepository.find({
      skip: (page - 1) * display,
      take: display,
      order: { no: 'ASC' },
      cache: true,
    });
  }

  public async addPokemonOfDatabase(): Promise<boolean> {
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
    const url = 'https://serebii.net/pokemon/nationalpokedex.shtml';
    const selector = '#content > main';
    const { getBrowserAndPage } = new PuppeteerUtil();
    const { browser, page } = await getBrowserAndPage(url, selector);
    const { crawling } = new PokemonIconImages(page);

    const pokemonIconImages = await crawling();
    await browser.close();

    return pokemonIconImages;
  }

  public async getPokemonImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    const url = 'https://serebii.net/pokemon/bulbasaur';
    const selector = '#content > main';
    const { getBrowserAndPage } = new PuppeteerUtil();
    const { browser, page } = await getBrowserAndPage(url, selector);
    const { crawling } = new PokemonImages(page);

    const pokemonImages = await crawling();
    await browser.close();

    return pokemonImages;
  }

  public async downloadImages(): Promise<void> {
    const progressBar = new ProgressBar();
    const { download } = new DownloadImage();
    const pokemonImages = getJson<IPokemonImage[]>({ fileName: 'pokemonImagesOfSerebiiNet.json' });
    const pokemonIconImages = getJson<IPokemonImage[]>({ fileName: 'pokemonIconImagesOfSerebiiNet.json' });
    const progress = (index: number, fileName: string, progressSize: number) => {
      const cursor = index + 1;
      Logger.log(`${cursor} : ${fileName}`, 'Download');
      progressBar.update((cursor / progressSize) * 100);
    };

    if (pokemonImages) {
      const imagesToDownload = pokemonImages.reduce<DataToDownload[]>((acc, p) => {
        const extension = 'png';

        const downloadData = { url: p.image, fileName: `${p.no}.${extension}` };
        if (!p.differentForm?.length) return [...acc, downloadData];

        const differentForm = p.differentForm.map(d => ({
          no: p.no,
          url: d.image,
          fileName: `${p.no}-${d.form}.${extension}`,
        }));
        return [...acc, downloadData, ...differentForm];
      }, []);

      for (const [index, { url, fileName, no }] of imagesToDownload.entries()) {
        const dirName = no && `download/${getGenerationName(+no)}`;
        await download(url, fileName, dirName);
        progress(index, fileName, imagesToDownload.length);
      }
    }

    if (pokemonIconImages) {
      const imagesToDownload = pokemonIconImages.map(p => ({ url: p.image, fileName: `${p.no}.png` }));
      for (const [index, { url, fileName }] of imagesToDownload.entries()) {
        const dirName = 'download/icon';
        await download(url, fileName, dirName);
        progress(index, fileName, imagesToDownload.length);
      }
    }
  }

  public async updatePokemonImageOfDatabase(): Promise<FindAndModifyWriteOpResultObject[]> {
    const pokemons = await this.pokemonOfDatabaseRepository.find({ order: { no: 'ASC' } });

    const updatedPokemons = pokemons.map(({ no, differentForm }, i) => {
      const dirName = getGenerationName(i);
      const image = setImage(dirName, no);
      const differentFormImage = setDifferentFormImage(dirName, differentForm);

      return this.pokemonOfDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { image, differentForm: differentFormImage } }, { returnOriginal: false })
        .then(({ value: pokemon }) => {
          Logger.log(`${i + 1} : ${pokemon.image}`, 'Updated Image');
          (<IPokemonOfDatabase[]>pokemon.differentForm).forEach(({ image }) => {
            Logger.log(image, 'Updated DifferentForm Image');
          });

          return pokemon;
        });
    });

    return Promise.all(updatedPokemons);
  }
}
