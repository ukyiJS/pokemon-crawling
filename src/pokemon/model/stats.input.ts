import { Field, InputType, Int } from '@nestjs/graphql';
import { IStats } from '../pokemon.interface';

@InputType()
export class StatsInput implements IStats {
  @Field()
  name: string;

  @Field(() => Int)
  value: number;
}
