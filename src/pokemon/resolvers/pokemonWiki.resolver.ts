import { getJson } from '@/utils';
import { Mutation, Resolver } from '@nestjs/graphql';
import { PokemonWiki } from '../model/pokemonWiki.entity';
import { PokemonService } from '../pokemon.service';

@Resolver(() => PokemonWiki)
export class PokemonWikiResolver {
  pokemons: PokemonWiki[] | null;
  constructor(private readonly pokemonService: PokemonService) {
    this.pokemons = getJson<PokemonWiki[]>({ fileName: 'pokemonWiki.json' });
  }

  @Mutation(() => [PokemonWiki], { nullable: true })
  public async addPokemonOfWiki(): Promise<PokemonWiki[] | null> {
    return this.pokemonService.addPokemonWiki(this.pokemons);
  }
}
