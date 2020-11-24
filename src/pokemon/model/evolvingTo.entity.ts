import { Field, ObjectType } from '@nestjs/graphql';
import { IEvolvingTo } from '../pokemon.interface';

@ObjectType()
export class EvolvingTo implements IEvolvingTo {
  @Field()
  no: string;

  @Field()
  name: string;

  @Field()
  image: string;

  @Field({ nullable: true })
  form: string;

  @Field()
  condition: string;

  @Field(() => [EvolvingTo])
  evolvingTo: EvolvingTo[];
}
