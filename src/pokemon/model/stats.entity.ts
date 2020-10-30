import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IStats } from '../pokemon.interface';

@ObjectType()
export class Stats implements IStats {
  @Field()
  name: string;

  @Field(() => Int)
  value: number;
}
