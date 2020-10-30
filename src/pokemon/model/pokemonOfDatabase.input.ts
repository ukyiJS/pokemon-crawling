import { Field, InputType, Int } from '@nestjs/graphql';
import { IPokemonOfDatabase } from '../pokemon.interface';
import { EggCycleInput } from './eggCycle.input';
import { GenderInput } from './gender.input';
import { StatsInput } from './stat.input';
import { TypeDefenseInput } from './typeDefense.input';

@InputType('pokemon')
export class PokemonOfDatabaseInput implements IPokemonOfDatabase {
  @Field()
  no: string;

  @Field()
  name: string;

  @Field()
  engName: string;

  @Field()
  image: string;

  @Field(() => [StatsInput])
  stats: StatsInput[];

  @Field(() => [String])
  types: string[];

  @Field(() => [TypeDefenseInput])
  typeDefenses: TypeDefenseInput[];

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

  @Field(() => [GenderInput])
  gender: GenderInput[];

  @Field(() => EggCycleInput)
  eggCycles: EggCycleInput;

  @Field({ nullable: true })
  form: string;

  @Field(() => [PokemonOfDatabaseInput])
  differentForm: PokemonOfDatabaseInput[];
}
