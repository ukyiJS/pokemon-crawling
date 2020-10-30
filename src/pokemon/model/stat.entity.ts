import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IStat } from '../pokemon.interface';

@ObjectType()
export class Stats implements IStat {
  @Field()
  name: string;

  @Field(() => Int)
  value: number;
}
