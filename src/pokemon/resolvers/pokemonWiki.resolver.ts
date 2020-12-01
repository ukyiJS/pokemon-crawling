import { Mutation, Resolver } from '@nestjs/graphql';
import { PokemonWiki } from '../model/pokemonWiki.entity';
import { PokemonService } from '../pokemon.service';

@Resolver(() => PokemonWiki)
export class PokemonWikiResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Mutation(() => Boolean)
  public async addPokemonOfWiki(): Promise<boolean> {
    return this.pokemonService.addPokemonWiki();
  }
}
