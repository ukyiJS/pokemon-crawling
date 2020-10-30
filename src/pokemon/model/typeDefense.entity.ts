import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ITypeDefense } from '../pokemon.interface';

@ObjectType()
export class TypeDefense implements ITypeDefense {
  @Field()
  type: string;

  @Field(() => Float)
  damage: number;
}
