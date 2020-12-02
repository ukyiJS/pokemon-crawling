import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class EvolvingToType {
  @Field()
  public no: string;
  @Field()
  public name: string;
  @Field()
  public image: string;
  @Field(() => [String])
  public types: string[];
  @Field(() => String, { nullable: true })
  public form: string | null;
  @Field({ nullable: true })
  public condition?: string;
  @Field(() => [String], { nullable: true })
  public conditions?: string[];
  @Field(() => [EvolvingToType], { nullable: true })
  public evolvingTo?: EvolvingToType[];
}
