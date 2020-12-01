import { getJson, Puppeteer } from '@/utils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CrawlingPokemonDatabase } from './crawling/pokemonDatabase';
import { CrawlingPokemonIconImageOfSerebiiNet } from './crawling/pokemonIconImageOfSerebiiNet';
import { CrawlingPokemonImageOfSerebiiNet } from './crawling/pokemonImageOfSerebiiNet';
import { CrawlingPokemonsWiki } from './crawling/PokemonsWiki';
import { AbilityNames } from './enums/abilityName.enum';
import { EggGroupNames } from './enums/eggGroupName.enum';
import { FormNames } from './enums/formName.enum';
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

  private replaceName(name: string): string {
    return name.replace(/(mega).*x$|(mega).*y$|^(mega).*|^(alola)n.*|^(galar)ian.*/gi, (str, ...$$) => {
      if (/^galarian.*(?:mode)/.test(str)) return str;
      const index = $$.findIndex(str => str);
      const matchText = $$[index];
      switch (index) {
        case 0:
          return `${matchText}X`;
        case 1:
          return `${matchText}Y`;
        case 2:
        case 3:
        case 4:
          return matchText;
        default:
          return str;
      }
    });
  }

  private convertToKorName = <T>(
    enums: T,
    nameToConvert: string | string[],
    isReplace?: boolean,
  ): string | string[] => {
    const removeSpecialSymbol = (text: string) => {
      return (isReplace ? this.replaceName(text) : text).replace(/[^a-z0-9]/gi, '');
    };
    const findKorName = (name: string) => {
      const [, result] = Object.entries(enums).find(([key]) => {
        return RegExp(`${removeSpecialSymbol(key)}$`, 'gi').test(removeSpecialSymbol(name));
      })!;
      return result;
    };

    try {
      if (Array.isArray(nameToConvert)) return nameToConvert.map(findKorName);
      return findKorName(nameToConvert);
    } catch (error) {
      Logger.error(`No matching ${nameToConvert} found`, '', 'NoMatchingError');
      throw error;
    }
  };

  private convertToKorNameByEvolvingTo = <T>(
    enums: T,
    key: keyof Omit<EvolvingToType, 'evolvingTo'>,
    evolvingTo: EvolvingToType[] = [],
    isReplace?: boolean,
  ): EvolvingToType[] | undefined => {
    const convertToKorName = this.convertToKorName.bind(null, enums);
    const convertToKorNameByEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, enums, key);
    const convert = (to: EvolvingToType) => {
      const name = to[key];
      return { ...to, [key]: name && convertToKorName(name, isReplace) };
    };

    const result = <EvolvingToType[]>evolvingTo?.map(convert);
    if (!result?.length) return undefined;

    return result.map(to => ({ ...to, evolvingTo: convertToKorNameByEvolvingTo(to.evolvingTo, isReplace) }));
  };

  public async updatePokemonName(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    const convertToKorName = (name: string): string => <string>this.convertToKorName(PokemonNames, name);
    const convertToNameOfEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, PokemonNames, 'name');
    const convert = ({ name, ...pokemon }: PokemonDatabase): PokemonDatabase => ({
      ...pokemon,
      name: convertToKorName(name),
    });

    return pokemons.map(({ evolvingTo, differentForm, ...pokemon }) => ({
      ...convert(pokemon),
      evolvingTo: convertToNameOfEvolvingTo(evolvingTo),
      differentForm: differentForm?.map(convert),
    }));
  }

  public async updatePokemonTypes(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    const convertToKorName = (name: string): string => <string>this.convertToKorName(TypeNames, name);
    const convertToKorNameByEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, TypeNames, 'types');
    const convert = ({ types, ...pokemon }: PokemonDatabase): PokemonDatabase => ({
      ...pokemon,
      types: types.map(type => convertToKorName(type)),
    });

    return pokemons.map(({ evolvingTo, differentForm, ...pokemon }) => ({
      ...convert(pokemon),
      evolvingTo: convertToKorNameByEvolvingTo(evolvingTo),
      differentForm: differentForm?.map(convert),
    }));
  }

  public async updatePokemonSpecies(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    const convertToKorName = (name: string): string => <string>this.convertToKorName(SpeciesNames, name);

    return pokemons.map(({ species, ...pokemon }) => ({ ...pokemon, species: convertToKorName(species) }));
  }

  public async updatePokemonAbilities(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    const convertToKorName = (name: string): string => <string>this.convertToKorName(AbilityNames, name);
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

  public async updatePokemonEggGroups(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    const convertToKorName = (name: string): string => <string>this.convertToKorName(EggGroupNames, name);

    return pokemons.map(({ eegGroups, ...pokemon }) => ({ ...pokemon, eegGroups: eegGroups.map(convertToKorName) }));
  }

  public async updateForm(pokemons: PokemonDatabase[]): Promise<PokemonDatabase[]> {
    const convertToKorNameByEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, FormNames, 'form');
    const convert = ({ form, ...pokemon }: PokemonDatabase): PokemonDatabase => ({
      ...pokemon,
      form: form && <string>this.convertToKorName(FormNames, form, true),
    });

    return pokemons.map(({ evolvingTo, differentForm, ...pokemon }) => ({
      ...convert(pokemon),
      evolvingTo: convertToKorNameByEvolvingTo(evolvingTo, true),
      differentForm: differentForm?.map(convert),
    }));
  }
}
