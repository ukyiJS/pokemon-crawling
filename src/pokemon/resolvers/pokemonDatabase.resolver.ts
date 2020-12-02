import { getJson } from '@/utils';
import { Mutation, Resolver } from '@nestjs/graphql';
import { IPokemonDatabase } from '../interfaces/pokemonDatabase.interface';
import { PokemonDatabase } from '../model/pokemonDatabase.entity';
import { PokemonService } from '../pokemon.service';

@Resolver(() => PokemonDatabase)
export class PokemonDatabaseResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Mutation(() => Boolean)
  public async addPokemonOfDatabase(): Promise<boolean> {
    return this.pokemonService.addPokemonDatabase();
  }

  @Mutation(() => [PokemonDatabase])
  public async updatePokemonName(): Promise<PokemonDatabase[]> {
    const pokemons = getJson<IPokemonDatabase[]>({ fileName: 'pokemonDatabase.json' });
    if (!pokemons) return [];
    return this.pokemonService.updatePokemonName(pokemons);
  }

  @Mutation(() => [PokemonDatabase])
  public async updatePokemonTypes(): Promise<PokemonDatabase[]> {
    const pokemons = getJson<IPokemonDatabase[]>({ fileName: 'pokemonDatabase.json' });
    if (!pokemons) return [];
    return this.pokemonService.updatePokemonTypes(pokemons);
  }

  @Mutation(() => [PokemonDatabase])
  public async updatePokemonSpecies(): Promise<PokemonDatabase[]> {
    const pokemons = getJson<IPokemonDatabase[]>({ fileName: 'pokemonDatabase.json' });
    if (!pokemons) return [];
    return this.pokemonService.updatePokemonSpecies(pokemons);
  }

  @Mutation(() => [PokemonDatabase])
  public async updatePokemonAbilities(): Promise<PokemonDatabase[]> {
    const pokemons = getJson<IPokemonDatabase[]>({ fileName: 'pokemonDatabase.json' });
    if (!pokemons) return [];
    return this.pokemonService.updatePokemonAbilities(pokemons);
  }

  @Mutation(() => [PokemonDatabase])
  public async updatePokemonEggGroups(): Promise<PokemonDatabase[]> {
    const pokemons = getJson<IPokemonDatabase[]>({ fileName: 'pokemonDatabase.json' });
    if (!pokemons) return [];
    return this.pokemonService.updatePokemonEggGroups(pokemons);
  }

  @Mutation(() => [PokemonDatabase])
  public async updatePokemonForm(): Promise<PokemonDatabase[]> {
    const pokemons = getJson<IPokemonDatabase[]>({ fileName: 'pokemonDatabase.json' });
    if (!pokemons) return [];
    return this.pokemonService.updatePokemonForm(pokemons);
  }
}
