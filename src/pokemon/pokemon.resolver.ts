import { Query, Resolver } from '@nestjs/graphql';
import { PokemonOfDatabase } from './model/pokemonOfDatabase.entity';
import { PokemonService } from './pokemon.service';

@Resolver()
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Query(() => [PokemonOfDatabase])
  public async findPokemonOfDatabases(): Promise<PokemonOfDatabase[]> {
    return this.pokemonService.findPokemonOfDatabases();
  }
}
