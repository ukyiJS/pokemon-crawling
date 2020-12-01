import { Field, InterfaceType } from '@nestjs/graphql';
import { PokemonWikiType } from '../types/pokemonWiki.type';

@InterfaceType()
export abstract class IPokemonWiki extends PokemonWikiType {
  @Field(() => [PokemonWikiType])
  public differentForm?: PokemonWikiType[];
}
