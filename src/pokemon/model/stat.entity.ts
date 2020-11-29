import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IStat } from '../pokemon.interface';

@ObjectType()
export class Stat implements IStat {
  @Field()
  public name: string;
  @Field(() => Int)
  public value: number;
}
