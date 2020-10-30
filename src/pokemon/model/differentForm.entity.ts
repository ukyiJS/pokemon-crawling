import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPokemonOfDatabase } from '../pokemon.interface';
import { EggCycle } from './eggCycle.entity';
import { Gender } from './gender.entity';
import { Stat } from './stat.entity';
import { TypeDefense } from './typeDefense.entity';

@ObjectType()
export class DifferentForm implements IPokemonOfDatabase {
  @Field()
  no: string;

  @Field()
  name: string;

  @Field()
  engName: string;

  @Field()
  image: string;

  @Field(() => [Stat])
  stats: Stat[];

  @Field(() => [String])
  types: string[];

  @Field(() => [TypeDefense])
  typeDefenses: TypeDefense[];

  @Field()
  species: string;

  @Field()
  height: string;

  @Field()
  weight: string;

  @Field(() => [String])
  abilities: string[];

  @Field({ nullable: true })
  hiddenAbility: string;

  @Field({ nullable: true })
  evYield: string;

  @Field(() => Int)
  catchRate: number;

  @Field(() => Int)
  friendship: number;

  @Field(() => Int)
  exp: number;

  @Field(() => [String])
  eegGroups: string[];

  @Field(() => [Gender])
  gender: Gender[];

  @Field(() => EggCycle)
  eggCycles: EggCycle;

  @Field({ nullable: true })
  form: string;

  @Field(() => [DifferentForm])
  differentForm: DifferentForm[];
}
