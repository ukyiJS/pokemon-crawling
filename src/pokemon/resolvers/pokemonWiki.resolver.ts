import { getJson } from '@/utils';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { PokemonWiki } from '../model/pokemonWiki.entity';
import { PokemonService } from '../pokemon.service';

@Resolver(() => PokemonWiki)
export class PokemonWikiResolver {
  pokemons: PokemonWiki[] | null;
  constructor(private readonly pokemonService: PokemonService) {
    this.pokemons = getJson<PokemonWiki[]>({ fileName: 'pokemonWiki.json' });
  }

  @Query(() => [PokemonWiki])
  public async getPokemonOfPokemonWiki(): Promise<PokemonWiki[]> {
    return this.pokemonService.getPokemonOfPokemonWiki();
  }

  @Mutation(() => [PokemonWiki], { nullable: true })
  public async addPokemonWiki(): Promise<PokemonWiki[] | null> {
    return this.pokemonService.addPokemonWiki(this.pokemons);
  }

  @Query(() => Boolean)
  public downloadPokemonImageOfPokemonWiki(): Promise<boolean> {
    return this.pokemonService.downloadPokemonImageOfPokemonWiki(this.pokemons);
  }
}
