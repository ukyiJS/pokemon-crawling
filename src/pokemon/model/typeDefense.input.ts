import { Field, Float, InputType } from '@nestjs/graphql';
import { ITypeDefense } from '../pokemon.interface';

@InputType()
export class TypeDefenseInput implements ITypeDefense {
  @Field()
  type: string;

  @Field(() => Float)
  damage: number;
}
