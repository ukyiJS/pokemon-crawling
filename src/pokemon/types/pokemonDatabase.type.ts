import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPokemon } from '../interfaces/pokemon.interface';
import { EggCycleType } from './eggCycle.type';
import { StatType } from './stat.type';
import { TypeDefenseType } from './typeDefense.type';

@ObjectType()
export abstract class PokemonDatabaseType extends IPokemon {
  @Field(() => String, { nullable: true })
  public evYield: string[] | null;
  @Field(() => Int)
  public exp: number;
  @Field(() => [EggCycleType], { nullable: true })
  public eggCycle: EggCycleType | null;
  @Field(() => [StatType])
  public stats: StatType[];
  @Field(() => [TypeDefenseType])
  public typeDefenses: TypeDefenseType[];
}
