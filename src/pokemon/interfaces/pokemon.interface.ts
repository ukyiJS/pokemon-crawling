import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { GenderType } from '../types/gender.type';
import { LanguageType } from '../types/language.type';

@InterfaceType()
export abstract class IPokemon {
  @Field()
  public no: string;
  @Field(() => LanguageType)
  public name: LanguageType;
  @Field()
  public image: string;
  @Field(() => [String])
  public types: string[];
  @Field()
  public species: string;
  @Field()
  public height: string;
  @Field()
  public weight: string;
  @Field(() => [String], { nullable: 'items' })
  public abilities: (string | null)[];
  @Field(() => String, { nullable: true })
  public hiddenAbility: string | null;
  @Field(() => Int)
  public catchRate: number;
  @Field(() => Int)
  public friendship: number;
  @Field(() => [String])
  public eegGroups: string[];
  @Field(() => [GenderType])
  public gender: GenderType[];
  @Field(() => String, { nullable: true })
  public form: string | null;
}
