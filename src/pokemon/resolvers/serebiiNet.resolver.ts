import { getJson } from '@/utils';
import { Query, Resolver } from '@nestjs/graphql';
import { SerebiiNet } from '../model/serebiiNet.entity';
import { PokemonService } from '../pokemon.service';

@Resolver()
export class SerebiiNetResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Query(() => Boolean)
  public downloadPokemonImageOfSerebiiNet(): Promise<boolean> {
    const pokemons = getJson<SerebiiNet[]>({ fileName: 'pokemonImageOfSerebiiNet.json' });
    return this.pokemonService.downloadPokemonImageOfSerebiiNet(pokemons);
  }

  @Query(() => Boolean)
  public downloadPokemonIconImageOfSerebiiNet(): Promise<boolean> {
    const pokemons = getJson<SerebiiNet[]>({ fileName: 'pokemonIconImageOfSerebiiNet.json' });
    return this.pokemonService.downloadPokemonIconImageOfSerebiiNet(pokemons);
  }
}
