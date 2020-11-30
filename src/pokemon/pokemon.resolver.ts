import { Mutation, Resolver } from '@nestjs/graphql';
import { PokemonService } from './pokemon.service';

@Resolver()
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Mutation(() => Boolean)
  public async addPokemonOfWiki(): Promise<boolean> {
    return this.pokemonService.addPokemonOfWiki();
  }

  @Mutation(() => Boolean)
  public async addPokemonOfDatabase(): Promise<boolean> {
    return this.pokemonService.addPokemonOfDatabase();
  }
}
