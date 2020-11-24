import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Any, FindAndModifyWriteOpResultObject } from 'typeorm';
import { PokemonOfDatabase } from './model/pokemonOfDatabase.entity';
import { PokemonService } from './pokemon.service';

@Resolver()
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Query(() => [PokemonOfDatabase])
  public async findPokemonOfDatabase(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('display', { type: () => Int, nullable: true }) display?: number,
  ): Promise<PokemonOfDatabase[]> {
    return this.pokemonService.findPokemonOfDatabase(page, display);
  }

  @Mutation(() => Boolean)
  public async addPokemonOfDatabase(): Promise<boolean> {
    return this.pokemonService.addPokemonOfDatabase();
  }

  @Mutation(() => [PokemonOfDatabase])
  public async updatePokemonImageOfDatabase(): Promise<FindAndModifyWriteOpResultObject[]> {
    return this.pokemonService.updatePokemonImageOfDatabase();
  }
}
