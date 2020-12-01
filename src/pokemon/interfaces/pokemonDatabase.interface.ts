import { Field, InterfaceType } from '@nestjs/graphql';
import { EvolvingToType } from '../types/evolvingTo.type';
import { PokemonDatabaseType } from '../types/pokemonDatabase.type';

@InterfaceType()
export abstract class IPokemonDatabase extends PokemonDatabaseType {
  @Field()
  public icon?: string;
  @Field(() => [EvolvingToType])
  public evolvingTo?: EvolvingToType[];
  @Field(() => [PokemonDatabaseType])
  public differentForm?: PokemonDatabaseType[];
}
