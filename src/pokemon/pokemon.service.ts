import {
  DataToDownload,
  DownloadImage,
  getGenerationName,
  getJson,
  ProgressBar,
  Puppeteer,
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
import { PokemonOfWiki } from './model/pokemonOfWiki.entity';
import { IPokemonImage, IPokemonOfDatabase, IPokemonOfWiki } from './pokemon.interface';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(PokemonOfDatabase)
    private readonly pokemonOfDatabaseRepository: MongoRepository<PokemonOfDatabase>,
    @InjectRepository(PokemonOfWiki)
    private readonly pokemonOfWiKiRepository: MongoRepository<PokemonOfWiki>,
  ) {}

  public async getPokemonsOfWiki(): Promise<IPokemonOfWiki[]> {
    const url = 'https://pokemon.fandom.com/ko/wiki/이상해씨';
    const { init } = new Puppeteer(url);
    const { browser, page } = await init();
    const { crawling } = new PokemonsOfWiki(page);

    const pokemons = await crawling();
    await browser.close();

    return pokemons;
  }

  public async getPokemonsOfDatabase(): Promise<IPokemonOfDatabase[]> {
    const url = 'https://pokemondb.net/pokedex/bulbasaur';
    const { init } = new Puppeteer(url);
    const { browser, page } = await init();
    const { crawling } = new PokemonsOfDatabase(page);

    const pokemons = await crawling();
    await browser.close();

    return pokemons;
  }

  public getMergedPokemon(): IPokemonOfDatabase[] {
    const pokemonWiki = getJson<PokemonOfWiki[]>({ fileName: 'pokemonsOfWiki.json' });
    const pokemonDatabase = getJson<PokemonOfDatabase[]>({ fileName: 'pokemonsOfDatabase.json' });
    if (!pokemonWiki) return [];
    if (!pokemonDatabase) return [];
    return pokemonDatabase.map((pokemon, i) => {
      const { species, color } = pokemonWiki[i];
      const { differentForm } = pokemon;

      const dynamaxForm = pokemonWiki[i].differentForm?.find(p => /^거다이맥스/.test(p.form));
      const dynamaxPokemon = <PokemonOfDatabase>{ ...pokemon, species, ...dynamaxForm, differentForm: [] };

      return { ...pokemon, color, species, differentForm: [...differentForm, dynamaxPokemon] };
    });
  }

  public async findPokemonOfDatabase(page = 1, display = 10): Promise<PokemonOfDatabase[]> {
    return this.pokemonOfDatabaseRepository.find({
      skip: (page - 1) * display,
      take: display,
      order: { no: 'ASC' },
      cache: true,
    });
  }

  public async addPokemonOfWiki(): Promise<boolean> {
    const pokemons = getJson<PokemonOfWiki[]>({ fileName: 'pokemonsOfWiki.json' });
    if (!pokemons) return false;
    try {
      await Promise.all(pokemons.map(pokemon => this.pokemonOfWiKiRepository.save(new PokemonOfWiki(pokemon))));
    } catch (error) {
      Logger.error(error.message, error.stack, error);
      throw error;
    }
    return true;
  }

  public async addPokemonOfDatabase(): Promise<boolean> {
    const pokemons = getJson<PokemonOfDatabase[]>({ fileName: 'pokemonsOfDatabase.json' });
    if (!pokemons) return false;
    try {
      await Promise.all(pokemons.map(pokemon => this.pokemonOfDatabaseRepository.save(new PokemonOfDatabase(pokemon))));
    } catch (error) {
      Logger.error(error.message, error.stack, error);
      throw error;
    }
    return true;
  }

  public async getPokemonIconImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    const url = 'https://serebii.net/pokemon/nationalpokedex.shtml';
    const { init } = new Puppeteer(url);
    const { browser, page } = await init();
    const { crawling } = new PokemonIconImages(page);

    const pokemonIconImages = await crawling();
    await browser.close();

    return pokemonIconImages;
  }

  public async getPokemonImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    const url = 'https://serebii.net/pokemon/bulbasaur';
    const { init } = new Puppeteer(url);
    const { browser, page } = await init();
    const { crawling } = new PokemonImages(page);

    const pokemonImages = await crawling();
    await browser.close();

    return pokemonImages;
  }

  public async downloadPokemonImagesOfSerebiiNet(): Promise<boolean> {
    const pokemonImages = getJson<IPokemonImage[]>({ fileName: 'pokemonImagesOfSerebiiNet.json' });
    if (!pokemonImages) return false;

    const progressBar = new ProgressBar();
    const { download } = new DownloadImage();

    const imagesToDownload = pokemonImages.reduce<DataToDownload[]>((acc, p) => {
      const extension = 'png';

      const downloadData = { no: p.no, url: p.image, fileName: `${p.no}.${extension}` };
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
      const cursor = index + 1;
      Logger.log(`${cursor} : ${fileName}`, 'Download');
      progressBar.update((cursor / imagesToDownload.length) * 100);
    }

    return true;
  }

  public async downloadPokemonIconImagesOfSerebiiNet(): Promise<boolean> {
    const pokemonIconImages = getJson<IPokemonImage[]>({ fileName: 'pokemonIconImagesOfSerebiiNet.json' });
    if (!pokemonIconImages) return false;

    const progressBar = new ProgressBar();
    const { download } = new DownloadImage();

    const imagesToDownload = pokemonIconImages.map(p => ({ url: p.image, fileName: `${p.no}.png` }));
    for (const [index, { url, fileName }] of imagesToDownload.entries()) {
      const dirName = 'download/icon';
      await download(url, fileName, dirName);
      const cursor = index + 1;
      Logger.log(`${cursor} : ${fileName}`, 'Download');
      progressBar.update((cursor / imagesToDownload.length) * 100);
    }

    return true;
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

  public async updatePokemonIconImageOfDatabase(): Promise<FindAndModifyWriteOpResultObject[]> {
    const pokemons = await this.pokemonOfDatabaseRepository.find({ order: { no: 'ASC' } });
    const updatedPokemons = pokemons.map(({ no }, i) => {
      const icon = setImage('icon', no);
      return this.pokemonOfDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { icon } }, { returnOriginal: false })
        .then(({ value: pokemon }) => {
          Logger.log(`${i + 1} : ${pokemon.icon}`, 'Updated Icon Image');
          return pokemon;
        });
    });

    return Promise.all(updatedPokemons);
  }
}
