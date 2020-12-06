import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { EggCycleType } from '../types/eggCycle.type';
import { EvolvingToType } from '../types/evolvingTo.type';
import { PokemonDatabaseType } from '../types/pokemonDatabase.type';
import { StatType } from '../types/stat.type';
import { TypeDefenseType } from '../types/typeDefense.type';

@InterfaceType()
export abstract class IPokemonDatabase extends PokemonDatabaseType {
  @Field({ nullable: true })
  public icon?: string;
  @Field(() => [String], { nullable: true })
  public evYield: string[] | null;
  @Field(() => Int)
  public exp: number;
  @Field(() => EggCycleType, { nullable: true })
  public eggCycle: EggCycleType | null;
  @Field(() => [StatType])
  public stats: StatType[];
  @Field(() => [TypeDefenseType])
  public typeDefenses: TypeDefenseType[];
  @Field(() => [EvolvingToType], { nullable: true })
  public evolvingTo?: EvolvingToType[];
  @Field(() => [PokemonDatabaseType], { nullable: true })
  public differentForm?: PokemonDatabaseType[];
}
