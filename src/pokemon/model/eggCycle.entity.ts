import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IEggCycle } from '../pokemon.interface';

@ObjectType()
export class EggCycle implements IEggCycle {
  @Field(() => Int)
  cycle: number;

  @Field(() => [Int], { nullable: true })
  step: number[];
}
