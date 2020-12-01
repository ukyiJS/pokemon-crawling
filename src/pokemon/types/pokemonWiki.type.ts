import { Field, ObjectType } from '@nestjs/graphql';
import { IPokemon } from '../interfaces/pokemon.interface';
import { ColorType } from './color.type';

@ObjectType()
export abstract class PokemonWikiType extends IPokemon {
  @Field(() => ColorType)
  public color: ColorType;
}
