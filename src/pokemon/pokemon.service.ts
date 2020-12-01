import { getJson, Puppeteer } from '@/utils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CrawlingPokemonDatabase } from './crawling/pokemonDatabase';
import { CrawlingPokemonIconImageOfSerebiiNet } from './crawling/pokemonIconImageOfSerebiiNet';
import { CrawlingPokemonImageOfSerebiiNet } from './crawling/pokemonImageOfSerebiiNet';
import { CrawlingPokemonsWiki } from './crawling/PokemonsWiki';
import { AbilityNames } from './enums/abilityName.enum';
import { PokemonNames } from './enums/pokemonName.enum';
import { TypeNames } from './enums/pokemonType.enum';
import { SpeciesNames } from './enums/speciesName.enum';
import { IPokemonDatabase } from './interfaces/pokemonDatabase.interface';
import { IPokemonWiki } from './interfaces/pokemonWiki.interface';
import { PokemonDatabase } from './model/pokemonDatabase.entity';
import { PokemonWiki } from './model/pokemonWiki.entity';
import { IPokemonImage } from './pokemon.interface';
import { EvolvingToType } from './types/evolvingTo.type';

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

  private convertToKorName = <T>(enums: T, nameToConvert: string): string => {
    const removeSpecialSymbol = (text: string) => {
      return text.replace(/(♂)|(♀)/, (str, $1, $2) => ($1 && 'M') || ($2 && 'F') || str).replace(/[^a-z0-9]/gi, '');
    };

    let result;
    try {
      [, result] = Object.entries(enums).find(([key]) => {
        return RegExp(`${removeSpecialSymbol(key)}$`, 'gi').test(removeSpecialSymbol(nameToConvert));
      })!;
    } catch (error) {
      Logger.error(`No matching ${nameToConvert} found`, '', 'NoMatchingError');
      throw error;
    }
    return result;
  };

  private convertToKorNameByEvolvingTo = <T>(
    enums: T,
    key: keyof EvolvingToType,
    evolvingTo?: EvolvingToType[],
  ): EvolvingToType[] | undefined => {
    const convertToKorName = this.convertToKorName.bind(null, enums);
    const convertToKorNameByEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, enums, key);
    const convert = (to: EvolvingToType) => {
      return { ...to, [key]: convertToKorName(<keyof typeof EvolvingToType>to[key]) };
    };

    const result = <EvolvingToType[]>evolvingTo?.map(convert);
    if (!result?.length) return undefined;

    return result.map(to => ({ ...to, evolvingTo: convertToKorNameByEvolvingTo(to?.evolvingTo) }));
  };

  public async updatePokemonName(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    const convertToKorName = this.convertToKorName.bind(null, PokemonNames);
    const convertToNameOfEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, PokemonNames, 'name');
    return pokemons.map(({ name, evolvingTo, differentForm, ...pokemon }) => ({
      ...pokemon,
      name: convertToKorName(name),
      evolvingTo: convertToNameOfEvolvingTo(evolvingTo),
      differentForm: differentForm?.map(({ name, ...differentForm }) => ({
        ...differentForm,
        name: convertToKorName(name),
      })),
    }));
  }

  public async updatePokemonTypes(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    const convertToKorName = this.convertToKorName.bind(null, TypeNames);
    const convertToKorNameByEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, TypeNames, 'types');

    return pokemons.map(({ types, evolvingTo, ...pokemon }) => ({
      ...pokemon,
      types: types.map(convertToKorName),
      evolvingTo: convertToKorNameByEvolvingTo(evolvingTo),
    }));
  }

  public async updatePokemonSpecies(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    const convertToKorName = this.convertToKorName.bind(null, SpeciesNames);
    return pokemons.map(({ species, ...pokemon }) => ({ ...pokemon, species: convertToKorName(species) }));
  }

  public async updatePokemonAbilities(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    const convertToKorName = this.convertToKorName.bind(null, AbilityNames);
    const convert = ({ abilities, hiddenAbility, ...pokemon }: PokemonDatabase) => ({
      ...pokemon,
      abilities: abilities.map(ability => ability && convertToKorName(ability)),
      hiddenAbility: hiddenAbility && convertToKorName(hiddenAbility),
    });

    return pokemons.map(({ differentForm, ...pokemon }) => ({
      ...convert(pokemon),
      differentForm: differentForm?.map(convert),
    }));
  }
}
