import { DataToDownload, DownloadImage, getJson, PuppeteerUtil } from '@/utils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { FindAndModifyWriteOpResultObject, MongoRepository } from 'typeorm';
import { PokemonsOfDatabase } from './crawling/pokemonDatabase/pokemons';
import { PokemonsOfWiki } from './crawling/pokemonWiki/pokemons';
import { PokemonIconImages } from './crawling/serebiiNet/pokemonIconImages';
import { PokemonImages } from './crawling/serebiiNet/pokemonImages';
import { PokemonOfDatabase } from './model/pokemonOfDatabase.entity';
import { IPokemonImage, IPokemonOfDatabase, IPokemonsOfWiki } from './pokemon.interface';
import { differentFormName } from './pokemon.type';

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
    const pokemonImages = getJson<IPokemonImage[]>({ fileName: 'pokemonImagesOfSerebiiNet.json' });
    const pokemonIconImages = getJson<IPokemonImage[]>({ fileName: 'pokemonIconImagesOfSerebiiNet.json' });
    const getDir = (dirName: string) => join(process.cwd(), 'download', dirName);

    if (pokemonImages) {
      const { multipleDownloads } = new DownloadImage(getDir('image'));
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
      await multipleDownloads(imagesToDownload);
    }

    if (pokemonIconImages) {
      const { multipleDownloads } = new DownloadImage(getDir('icon'));
      const imagesToDownload = pokemonIconImages.map(p => ({ url: p.image, fileName: `${p.no}.png` }));
      await multipleDownloads(imagesToDownload);
    }
  }

  public async updateImage(): Promise<FindAndModifyWriteOpResultObject[]> {
    const pokemons = await this.pokemonOfDatabaseRepository.find({ order: { no: 'ASC' } });
    const getImageUrl = (name: string) => {
      return `https://raw.githubusercontent.com/ukyiJS/pokemon-crawling/image/main/${name}.png`;
    };

    const setImage = (no: string) => ({ image: getImageUrl(no) });
    const setDifferentFormImage = (differentForm: IPokemonOfDatabase[]) => {
      const convertToDifferentFormImage = differentForm.map(pokemon => {
        const [key] = Object.entries(differentFormName).find(([, value]) => {
          return RegExp(value, 'gi').test(pokemon.form ?? '');
        })!;
        const convertToImageName = key.toLowerCase().replace(/[^a-z]+(\w|$)/g, (_, $1) => {
          return $1.toUpperCase();
        });

        return { ...pokemon, image: getImageUrl(`${pokemon.no}-${convertToImageName}`) };
      });
      return { differentForm: convertToDifferentFormImage };
    };

    const updatedPokemons = pokemons.map(({ no, differentForm }, i) => {
      return this.pokemonOfDatabaseRepository
        .findOneAndUpdate(
          { no },
          { $set: { ...setImage(no), ...setDifferentFormImage(differentForm) } },
          { returnOriginal: false },
        )
        .then(pokemon => {
          Logger.log(`${i + 1} : ${pokemon.value.image}`, 'Updated Image');
          (<IPokemonOfDatabase[]>pokemon.value.differentForm).forEach(pokemon => {
            Logger.log(pokemon.image, 'Updated DifferentForm Image');
          });
          return pokemon.value;
        });
    });

    return Promise.all(updatedPokemons);
  }
}
