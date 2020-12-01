import { Field, Int, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class IDatabaseColumn {
  @Field()
  public _id?: string;
  @Field(() => Date)
  public createdAt?: Date;
  @Field(() => Int)
  public searchCount?: number;
}
