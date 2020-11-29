import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPokemonOfDatabase } from '../pokemon.interface';
import { EggCycle } from './eggCycle.entity';
import { Gender } from './gender.entity';
import { Stat } from './stat.entity';
import { TypeDefense } from './typeDefense.entity';

@ObjectType()
export class DifferentForm implements IPokemonOfDatabase {
  @Field()
  public no: string;
  @Field()
  public name: string;
  @Field()
  public engName: string;
  @Field()
  public image: string;
  @Field(() => [Stat])
  public stats: Stat[];
  @Field(() => [String])
  public types: string[];
  @Field(() => [TypeDefense])
  public typeDefenses: TypeDefense[];
  @Field()
  public species: string;
  @Field()
  public height: string;
  @Field()
  public weight: string;
  @Field(() => [String])
  public abilities: string[];
  @Field({ nullable: true })
  public hiddenAbility: string;
  @Field({ nullable: true })
  public evYield: string;
  @Field(() => Int)
  public catchRate: number;
  @Field(() => Int)
  public friendship: number;
  @Field(() => Int)
  public exp: number;
  @Field(() => [String])
  public eegGroups: string[];
  @Field(() => [Gender])
  public gender: Gender[];
  @Field(() => EggCycle)
  public eggCycle: EggCycle;
  @Field({ nullable: true })
  public form: string;
  @Field(() => [DifferentForm])
  differentForm?: DifferentForm[];
}
