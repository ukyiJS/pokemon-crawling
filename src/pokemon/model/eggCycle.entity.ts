import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IEggCycle } from '../pokemon.interface';

@ObjectType()
export class EggCycle implements IEggCycle {
  @Field(() => Int)
  public value: number;
  @Field(() => [Int], { nullable: true })
  public step: number[];
}
