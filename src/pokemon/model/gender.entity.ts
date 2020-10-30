import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IGender } from '../pokemon.interface';

@ObjectType()
export class Gender implements IGender {
  @Field()
  name: string;

  @Field(() => Int)
  ratio: number;
}
