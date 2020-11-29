import { Field, ObjectType } from '@nestjs/graphql';
import { IEvolvingTo } from '../pokemon.interface';

@ObjectType()
export class EvolvingTo implements IEvolvingTo {
  @Field()
  public no: string;
  @Field()
  public name: string;
  @Field()
  public image: string;
  @Field({ nullable: true })
  public form: string;
  @Field()
  public condition: string;
  @Field(() => [EvolvingTo])
  public evolvingTo: EvolvingTo[];
}
