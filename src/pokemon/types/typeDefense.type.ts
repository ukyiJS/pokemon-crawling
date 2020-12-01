import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class TypeDefenseType {
  @Field()
  public type: string;
  @Field(() => Float)
  public damage: number;
}
