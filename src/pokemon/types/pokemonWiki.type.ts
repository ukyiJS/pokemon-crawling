import { Field, ObjectType } from '@nestjs/graphql';
import { IPokemon } from '../interfaces/pokemon.interface';

@ObjectType()
export abstract class PokemonWikiType extends IPokemon {
  @Field(() => [PokemonWikiType], { nullable: true })
  public differentForm?: PokemonWikiType[];
}
