import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class EvolvingToType {
  @Field()
  public no: string;
  @Field()
  public name: string;
  @Field()
  public image: string;
  @Field(() => String, { nullable: true })
  public form: string | null;
  @Field()
  public condition?: string;
  @Field(() => [EvolvingToType])
  public evolvingTo?: EvolvingToType[];
}
