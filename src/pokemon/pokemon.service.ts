import { getJson, Puppeteer } from '@/utils';
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

  public async addPokemonWiki(): Promise<boolean> {
    const pokemons = getJson<IPokemonWiki[]>({ fileName: 'pokemonsOfWiki.json' });
    if (!pokemons) return false;

    const savePokemon = (pokemon: PokemonWiki) => {
      return this.pokemonWiKiRepository.save(new PokemonWiki(pokemon));
    };
    await Promise.all(pokemons.map(savePokemon));
    return true;
  }

  public async addPokemonDatabase(): Promise<boolean> {
    const pokemons = getJson<IPokemonDatabase[]>({ fileName: 'pokemonsOfDatabase.json' });
    if (!pokemons) return false;

    const savePokemon = (pokemon: PokemonDatabase) => {
      return this.pokemonDatabaseRepository.save(new PokemonDatabase(pokemon));
    };
    await Promise.all(pokemons.map(savePokemon));
    return true;
  }

  public async updatePokemonName(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    return this.convertPokemonName(pokemons);
  }

  public async updatePokemonTypes(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    return this.convertPokemonTypes(pokemons);
  }

  public async updatePokemonSpecies(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    return this.convertPokemonSpecies(pokemons);
  }
}
