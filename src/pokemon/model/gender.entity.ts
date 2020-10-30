import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IGender } from '../pokemon.interface';

@ObjectType()
export class Gender implements IGender {
  @Field()
  name: string;

  @Field(() => Float)
  ratio: number;
}
