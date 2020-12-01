import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class ColorType {
  @Field()
  public name: string;
  @Field()
  public code: string;
}
