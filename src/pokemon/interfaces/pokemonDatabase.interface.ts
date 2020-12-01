import { Field, InterfaceType } from '@nestjs/graphql';
import { EvolvingToType } from '../types/evolvingTo.type';
import { PokemonDatabaseType } from '../types/pokemonDatabase.type';

@InterfaceType()
export abstract class IPokemonDatabase extends PokemonDatabaseType {
  @Field()
  public icon?: string;
  @Field(() => [EvolvingToType], { nullable: true })
  public evolvingTo?: EvolvingToType[];
  @Field(() => [PokemonDatabaseType], { nullable: true })
  public differentForm?: PokemonDatabaseType[];
}
