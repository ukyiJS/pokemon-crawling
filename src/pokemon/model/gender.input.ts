import { Field, InputType, Int } from '@nestjs/graphql';
import { IGender } from '../pokemon.interface';

@InputType()
export class GenderInput implements IGender {
  @Field()
  name: string;

  @Field(() => Int)
  ratio: number;
}
