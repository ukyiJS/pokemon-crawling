import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class GenderType {
  @Field()
  public name: string;
  @Field(() => Float)
  public ratio: number;
}
