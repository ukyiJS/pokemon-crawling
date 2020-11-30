import { getJson, Puppeteer } from '@/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CrawlingPokemonOfDatabase, CrawlingPokemonsOfWiki } from './crawling';
import { CrawlingPokemonIconImageOfSerebiiNet } from './crawling/pokemonIconImageOfSerebiiNet';
import { CrawlingPokemonImageOfSerebiiNet } from './crawling/pokemonImageOfSerebiiNet';
import { PokemonOfDatabaseEntity } from './model/pokemonOfDatabase.entity';
import { PokemonOfWikiEntity } from './model/pokemonOfWiki.entity';
import { IPokemonImage, PokemonOfDatabase, PokemonOfWiki } from './pokemon.interface';

@Injectable()
export class PokemonService extends Puppeteer {
  constructor(
    @InjectRepository(PokemonOfWikiEntity)
    private readonly pokemonOfWiKiRepository: MongoRepository<PokemonOfWikiEntity>,
    @InjectRepository(PokemonOfDatabaseEntity)
    private readonly pokemonOfDatabaseRepository: MongoRepository<PokemonOfDatabaseEntity>,
  ) {
    super();
  }

  public async getPokemonsOfWiki(): Promise<PokemonOfWiki[]> {
    const { browser, page } = await this.initPuppeteer('https://pokemon.fandom.com/ko/wiki/이상해씨');
    const { crawling } = new CrawlingPokemonsOfWiki();

    const pokemons = await crawling(page);
    await browser.close();

    return pokemons;
  }

  public async getPokemonsOfDatabase(): Promise<PokemonOfDatabase[]> {
    const { browser, page } = await this.initPuppeteer('https://pokemondb.net/pokedex/bulbasaur');
    const { crawling } = new CrawlingPokemonOfDatabase();

    const pokemons = await crawling(page);
    await browser.close();

    return pokemons;
  }

  public async getPokemonIconImageOfSerebiiNet(): Promise<IPokemonImage[]> {
    const { browser, page } = await this.initPuppeteer('https://serebii.net/pokemon/nationalpokedex.shtml');
    const { crawling } = new CrawlingPokemonIconImageOfSerebiiNet();

    const pokemonIconImages = await crawling(page);
    await browser.close();

    return pokemonIconImages;
  }

  public async getPokemonImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    const { browser, page } = await this.initPuppeteer('https://serebii.net/pokemon/bulbasaur');
    const { crawling } = new CrawlingPokemonImageOfSerebiiNet();

    const pokemonImages = await crawling(page);
    await browser.close();

    return pokemonImages;
  }

  public async addPokemonsOfWiki(): Promise<boolean> {
    const pokemons = getJson<PokemonOfWiki[]>({ fileName: 'pokemonsOfWiki.json' });
    if (!pokemons) return false;

    const savePokemon = (pokemon: PokemonOfWikiEntity) => {
      return this.pokemonOfWiKiRepository.save(new PokemonOfWikiEntity(pokemon));
    };
    await Promise.all(pokemons.map(savePokemon));
    return true;
  }

  public async addPokemonsOfDatabase(): Promise<boolean> {
    const pokemons = getJson<PokemonOfDatabase[]>({ fileName: 'pokemonsOfDatabase.json' });
    if (!pokemons) return false;

    const savePokemon = (pokemon: PokemonOfDatabaseEntity) => {
      return this.pokemonOfDatabaseRepository.save(new PokemonOfDatabaseEntity(pokemon));
    };
    await Promise.all(pokemons.map(savePokemon));
    return true;
  }
}
