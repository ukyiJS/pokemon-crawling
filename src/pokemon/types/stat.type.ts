import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class StatType {
  @Field()
  public name: string;
  @Field(() => Int)
  public value: number;
}
