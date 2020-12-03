import { Field, ObjectType } from '@nestjs/graphql';
import { LanguageType } from './language.type';

@ObjectType()
export abstract class SerebiiNetType {
  @Field()
  public no: string;
  @Field(() => LanguageType)
  public name: LanguageType;
  @Field()
  public image: string;
  @Field(() => String, { nullable: true })
  public form?: string | null;
}
