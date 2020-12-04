import { Field, InterfaceType } from '@nestjs/graphql';
import { IPokemon } from './pokemon.interface';

@InterfaceType()
export abstract class IPokemonWiki extends IPokemon {
  @Field(() => [IPokemon])
  public differentForm?: IPokemon[];
}
