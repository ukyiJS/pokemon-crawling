import { Field, InputType, Int } from '@nestjs/graphql';
import { IStat } from '../pokemon.interface';

@InputType()
export class StatsInput implements IStat {
  @Field()
  name: string;

  @Field(() => Int)
  value: number;
}
