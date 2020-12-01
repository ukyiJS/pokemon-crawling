import { Mutation, Resolver } from '@nestjs/graphql';
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
    return this.pokemonService.updatePokemonName();
  }
}
