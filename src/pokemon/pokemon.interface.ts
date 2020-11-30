import { Field, Float, Int, InterfaceType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class Stat {
  @Field()
  public name: string;
  @Field(() => Int)
  public value: number;
}

@ObjectType()
export abstract class Color {
  @Field()
  public name: string;
  @Field()
  public code: string;
}

@ObjectType()
export abstract class Gender {
  @Field()
  public name: string;
  @Field(() => Float)
  public ratio: number;
}

@ObjectType()
export abstract class TypeDefense {
  @Field()
  public type: string;
  @Field(() => Float)
  public damage: number;
}

@ObjectType()
export abstract class EggCycle {
  @Field(() => Int)
  public value: number;
  @Field(() => Int, { nullable: true })
  public step: number[] | null;
}

@ObjectType()
export abstract class EvolvingTo {
  @Field()
  public no: string;
  @Field()
  public name: string;
  @Field()
  public image: string;
  @Field(() => String, { nullable: true })
  public form: string | null;
  @Field()
  public condition?: string;
  @Field(() => [EvolvingTo])
  public evolvingTo?: EvolvingTo[];
}

@InterfaceType()
export abstract class Pokemon {
  @Field()
  public no: string;
  @Field()
  public name: string;
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
  @Field(() => [Gender])
  public gender: Gender[];
  @Field(() => String, { nullable: true })
  public form: string | null;
}

@InterfaceType()
export abstract class DatabaseColumn {
  @Field()
  public _id?: string;
  @Field(() => Float)
  public createdAt?: number;
  @Field(() => Int)
  public searchCount?: number;
}

@InterfaceType()
export abstract class PokemonOfWiki extends Pokemon {
  @Field()
  public color: Color;
  @Field(() => [PokemonOfWiki])
  public differentForm?: PokemonOfWiki[];
}

@InterfaceType()
export abstract class PokemonOfDatabase extends Pokemon {
  @Field()
  public icon?: string;
  @Field(() => String, { nullable: true })
  public evYield: string | null;
  @Field(() => Int)
  public exp: number;
  @Field(() => [EggCycle], { nullable: true })
  public eggCycle: EggCycle | null;
  @Field(() => [Stat])
  public stats: Stat[];
  @Field(() => [TypeDefense])
  public typeDefenses: TypeDefense[];
  @Field(() => [EvolvingTo])
  public evolvingTo?: EvolvingTo[];
  @Field(() => [PokemonOfDatabase])
  public differentForm?: PokemonOfDatabase[];
}

export interface IDifferentFormImage {
  image: string;
  form: string;
}

export interface IPokemonImage {
  no: string;
  name: string;
  image: string;
  form?: string | null;
  differentForm?: IDifferentFormImage[];
}
