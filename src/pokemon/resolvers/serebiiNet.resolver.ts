import { getJson } from '@/utils';
import { Query, Resolver } from '@nestjs/graphql';
import { IPokemonImage } from '../pokemon.interface';
import { PokemonService } from '../pokemon.service';

@Resolver()
export class SerebiiNetResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Query(() => Boolean)
  public downloadPokemonImageOfSerebiiNet(): Promise<boolean> {
    const pokemons = getJson<IPokemonImage[]>({ fileName: 'pokemonImageOfSerebiiNet.json' });
    return this.pokemonService.downloadPokemonImageOfSerebiiNet(pokemons);
  }

  @Query(() => Boolean)
  public downloadPokemonIconImageOfSerebiiNet(): Promise<boolean> {
    const pokemons = getJson<IPokemonImage[]>({ fileName: 'pokemonIconImageOfSerebiiNet.json' });
    return this.pokemonService.downloadPokemonIconImageOfSerebiiNet(pokemons);
  }
}
