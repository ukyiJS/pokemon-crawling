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
    const pokemons = getJson<IPokemonDatabase[]>({ fileName: 'pokemonsOfDatabase.json' });
    if (!pokemons) return [];
    return this.pokemonService.updatePokemonName(pokemons);
  }

  @Mutation(() => [PokemonDatabase])
  public async updatePokemonTypes(): Promise<PokemonDatabase[]> {
    const pokemons = getJson<IPokemonDatabase[]>({ fileName: 'pokemonsOfDatabase.json' });
    if (!pokemons) return [];
    return this.pokemonService.updatePokemonTypes(pokemons);
  }
}
