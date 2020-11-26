import { Field, ObjectType } from "@nestjs/graphql";
import { IColor } from "../pokemon.interface";

@ObjectType()
export class Color implements IColor {
  @Field()
  public name: string;
  @Field()
  public code: string;
}