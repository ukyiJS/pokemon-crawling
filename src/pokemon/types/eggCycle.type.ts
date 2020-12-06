import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class EggCycleType {
  @Field(() => Int)
  public value: number;
  @Field(() => [Int], { nullable: true })
  public step: number[];
}
