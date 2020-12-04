import { ImageUtil, Puppeteer } from '@/utils';
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
import { SerebiiNet } from './model/serebiiNet.entity';

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

  public async crawlingPokemonWiki(): Promise<IPokemonWiki[]> {
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

  public async getPokemonIconImagOfSerebiiNet(): Promise<SerebiiNet[]> {
    const { browser, page } = await this.initPuppeteer('https://serebii.net/pokemon/nationalpokedex.shtml');
    const { crawling } = new CrawlingPokemonIconImageOfSerebiiNet();

    const pokemonIconImages = await crawling(page);
    await browser.close();

    return pokemonIconImages;
  }

  public async getPokemonImageOfSerebiiNet(): Promise<SerebiiNet[]> {
    const { browser, page } = await this.initPuppeteer('https://serebii.net/pokemon/bulbasaur');
    const { crawling } = new CrawlingPokemonImageOfSerebiiNet();

    const pokemonImages = await crawling(page);
    await browser.close();

    return pokemonImages;
  }

  public async downloadPokemonImageOfSerebiiNet(pokemonImages: SerebiiNet[] | null): Promise<boolean> {
    if (!pokemonImages) return false;

    const { convertImageToDownload, multiDownloads } = new ImageUtil();
    const imagesToDownload = convertImageToDownload(pokemonImages, 'serebiiNet', true);
    await multiDownloads(imagesToDownload);

    return true;
  }

  public async downloadPokemonIconImageOfSerebiiNet(pokemonImages: SerebiiNet[] | null): Promise<boolean> {
    if (!pokemonImages) return false;

    const { convertImageToDownload, multiDownloads } = new ImageUtil();
    const imagesToDownload = convertImageToDownload(pokemonImages, 'serebiiNet/icon');
    await multiDownloads(imagesToDownload);

    return true;
  }

  public async downloadPokemonImageOfWiki(pokemons: PokemonWiki[] | null): Promise<boolean> {
    if (!pokemons) return false;

    const pokemonImages = <SerebiiNet[]>pokemons.map(({ no, name, image, form, differentForm }) => ({
      no,
      name,
      image,
      form,
      differentForm: differentForm?.map(({ no, name, image, form }) => ({ no, name, image, form })),
    }));
    const { convertImageToDownload, multiDownloads } = new ImageUtil();
    const imagesToDownload = convertImageToDownload(pokemonImages, 'wiki', true);
    await multiDownloads(imagesToDownload);

    return true;
  }

  public async updateImageOfPokemonDatabase(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const { updatePokemonImages } = new ImageUtil();
    return updatePokemonImages(pokemons);
  }

  public async updateIconImageOfPokemonDatabase(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const { updatePokemonIconImages } = new ImageUtil();
    return updatePokemonIconImages(pokemons);
  }

  public async addPokemonWiki(pokemons: PokemonWiki[] | null): Promise<PokemonWiki[] | null> {
    if (!pokemons) return null;

    const savedPokemons = pokemons.map(pokemon => this.pokemonWiKiRepository.save(new PokemonWiki(pokemon)));
    return Promise.all(savedPokemons);
  }

  public async addPokemonDatabase(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    const savedPokemons = pokemons.map(pokemon => this.pokemonDatabaseRepository.save(new PokemonDatabase(pokemon)));
    const savedResult = await Promise.all(savedPokemons);

    const updatedPokemons = await this.updateIconImageOfPokemonDatabase(savedResult)
      .then(result => this.updateImageOfPokemonDatabase(result))
      .then(result => this.updatePokemonName(result))
      .then(result => this.updatePokemonTypes(result))
      .then(result => this.updatePokemonSpecies(result))
      .then(result => this.updatePokemonAbilities(result))
      .then(result => this.updatePokemonEggGroups(result))
      .then(result => this.updatePokemonForm(result))
      .then(result => this.updatePokemonEvolutionCondition(result));

    const updatedResult = updatedPokemons!.map(({ no, ...pokemon }) => {
      return this.pokemonDatabaseRepository
        .findOneAndUpdate({ no }, { $set: pokemon }, { returnOriginal: false })
        .then(({ value: pokemon }) => <PokemonDatabase>pokemon);
    });
    return Promise.all(updatedResult);
  }

  public async updatePokemonName(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertPokemonName(pokemons);
  }

  public async updatePokemonTypes(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertPokemonTypes(pokemons);
  }

  public async updatePokemonSpecies(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertPokemonSpecies(pokemons);
  }

  public async updatePokemonAbilities(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertPokemonAbilities(pokemons);
  }

  public async updatePokemonEggGroups(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertPokemonEggGroups(pokemons);
  }

  public async updatePokemonForm(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertPokemonForm(pokemons);
  }

  public async updatePokemonEvolutionCondition(pokemons: PokemonDatabase[] | null): Promise<PokemonDatabase[] | null> {
    if (!pokemons) return null;

    return this.convertPokemonEvolutionCondition(pokemons);
  }
}
