import { getJson, ImageUtil, Puppeteer } from '@/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CrawlingPokemonDatabase } from './crawling/pokemonDatabase';
import { CrawlingPokemonIconImageOfSerebiiNet } from './crawling/pokemonIconImageOfSerebiiNet';
import { CrawlingPokemonImageOfSerebiiNet } from './crawling/pokemonImageOfSerebiiNet';
import { CrawlingPokemonsWiki } from './crawling/PokemonsWiki';
import { IPokemonDatabase } from './interfaces/pokemonDatabase.interface';
import { IPokemonWiki } from './interfaces/pokemonWiki.interface';
import { PokemonDatabase } from './model/pokemonDatabase.entity';
import { PokemonWiki } from './model/pokemonWiki.entity';
import { IPokemonImage } from './pokemon.interface';

@Injectable()
export class PokemonService extends Puppeteer {
  constructor(
    @InjectRepository(PokemonWiki)
    private readonly pokemonWiKiRepository: MongoRepository<PokemonWiki>,
    @InjectRepository(PokemonDatabase)
    private readonly pokemonDatabaseRepository: MongoRepository<PokemonDatabase>,
  ) {
    super();
  }

  public async getPokemonWiki(): Promise<IPokemonWiki[]> {
    const { browser, page } = await this.initPuppeteer('https://pokemon.fandom.com/ko/wiki/이상해씨');
    const { crawling } = new CrawlingPokemonsWiki();

    const pokemons = await crawling(page);
    await browser.close();

    return pokemons;
  }

  public async getPokemonDatabase(): Promise<IPokemonDatabase[]> {
    const { browser, page } = await this.initPuppeteer('https://pokemondb.net/pokedex/bulbasaur');
    const { crawling } = new CrawlingPokemonDatabase();

    const pokemons = await crawling(page);
    await browser.close();

    return pokemons;
  }

  public async getPokemonIconImagOfSerebiiNet(): Promise<IPokemonImage[]> {
    const { browser, page } = await this.initPuppeteer('https://serebii.net/pokemon/nationalpokedex.shtml');
    const { crawling } = new CrawlingPokemonIconImageOfSerebiiNet();

    const pokemonIconImages = await crawling(page);
    await browser.close();

    return pokemonIconImages;
  }

  public async getPokemonImageOfSerebiiNet(): Promise<IPokemonImage[]> {
    const { browser, page } = await this.initPuppeteer('https://serebii.net/pokemon/bulbasaur');
    const { crawling } = new CrawlingPokemonImageOfSerebiiNet();

    const pokemonImages = await crawling(page);
    await browser.close();

    return pokemonImages;
  }

  public async downloadPokemonImageOfSerebiiNet(): Promise<boolean> {
    const pokemonImages = getJson<IPokemonImage[]>({ fileName: 'pokemonImageOfSerebiiNet.json' });
    if (!pokemonImages) return false;

    const { convertImageToDownload, mutilDownloads } = new ImageUtil();
    const imagesToDownload = convertImageToDownload(pokemonImages);
    await mutilDownloads(imagesToDownload);

    return true;
  }

  public async downloadPokemonIconImageOfSerebiiNet(): Promise<boolean> {
    const pokemonImages = getJson<IPokemonImage[]>({ fileName: 'pokemonIconImageOfSerebiiNet.json' });
    if (!pokemonImages) return false;

    const { convertImageToDownload, mutilDownloads } = new ImageUtil();
    const imagesToDownload = convertImageToDownload(pokemonImages, '');
    await mutilDownloads(imagesToDownload);

    return true;
  }

  public async updateImageOfPokemonDatabase(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const { updatePokemonImages } = new ImageUtil();
    const updatedPokemons = updatePokemonImages(pokemons).map(({ no, image, differentForm }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { image, differentForm } }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });

    return Promise.all(updatedPokemons);
  }

  public async updateIconImageOfPokemonDatabase(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const { updatePokemonIconImages } = new ImageUtil();
    const updatedPokemons = updatePokemonIconImages(pokemons).map(({ no, icon }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { icon } }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });

    return Promise.all(updatedPokemons);
  }

  public async addPokemonWiki(): Promise<boolean> {
    const pokemons = getJson<IPokemonWiki[]>({ fileName: 'pokemonOfWiki.json' });
    if (!pokemons) return false;

    const savePokemon = (pokemon: PokemonWiki) => {
      return this.pokemonWiKiRepository.save(new PokemonWiki(pokemon));
    };
    await Promise.all(pokemons.map(savePokemon));
    return true;
  }

  public async addPokemonDatabase(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const savedPokemons = pokemons.map(pokemon => this.pokemonDatabaseRepository.save(new PokemonDatabase(pokemon)));
    return Promise.all(savedPokemons);
  }

  public async updatePokemonName(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const updatedPokemons = this.convertPokemonName(pokemons).map(({ no, name }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { name } }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });

    return Promise.all(updatedPokemons);
  }

  public async updatePokemonTypes(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const updatedPokemons = this.convertPokemonTypes(pokemons).map(({ no, name }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { name } }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });

    return Promise.all(updatedPokemons);
  }

  public async updatePokemonSpecies(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const updatedPokemons = this.convertPokemonSpecies(pokemons).map(({ no, name }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { name } }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });

    return Promise.all(updatedPokemons);
  }

  public async updatePokemonAbilities(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const updatedPokemons = this.convertPokemonAbilities(pokemons).map(({ no, name }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { name } }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });

    return Promise.all(updatedPokemons);
  }

  public async updatePokemonEggGroups(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const updatedPokemons = this.convertPokemonEggGroups(pokemons).map(({ no, name }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { name } }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });

    return Promise.all(updatedPokemons);
  }

  public async updatePokemonForm(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const updatedPokemons = this.convertPokemonForm(pokemons).map(({ no, name }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: { name } }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });

    return Promise.all(updatedPokemons);
  }

  public async updatePokemonEvolutionCondition(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertPokemonEvolutionCondition(pokemons);
  }
}
