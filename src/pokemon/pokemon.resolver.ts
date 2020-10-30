import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PokemonOfDatabase } from './model/pokemonOfDatabase.entity';
import { PokemonService } from './pokemon.service';

@Resolver()
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Query(() => [PokemonOfDatabase])
  public async findPokemonOfDatabases(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('display', { type: () => Int, nullable: true }) display?: number,
  ): Promise<PokemonOfDatabase[]> {
    return this.pokemonService.findPokemonOfDatabases(page, display);
  }

  @Mutation(() => Boolean)
  public async addPokemonOfDatabases(): Promise<boolean> {
    return this.pokemonService.addPokemonOfDatabases();
  }
}
