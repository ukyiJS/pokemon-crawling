import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class LanguageType {
  @Field()
  public kor: string;
  @Field()
  public eng: string;
}
