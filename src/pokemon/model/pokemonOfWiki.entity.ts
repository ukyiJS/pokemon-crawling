import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Expose, plainToClass } from "class-transformer";
import { Column, Entity, ObjectIdColumn } from "typeorm";
import { v4 } from "uuid";
import { IPokemonOfWiki } from "../pokemon.interface";
import { Color } from "./color.entity";
import { Gender } from "./gender.entity";

@Entity()
@ObjectType()
export class PokemonOfWiki implements IPokemonOfWiki {
  @Expose()
  @ObjectIdColumn()
  @Field()
  public _id?:string;
  @Expose()
  @Column()
  @Field()
  public no: string;
  @Expose()
  @Column()
  @Field()
  public name: string;
  @Expose()
  @Column()
  @Field()
  public engName: string;
  @Expose()
  @Column()
  @Field()
  public image: string;
  @Expose()
  @Column()
  @Field(() => [String])
  public types: string[];
  @Expose()
  @Column()
  @Field()
  public species: string;
  @Expose()
  @Column()
  @Field(() => [String])
  public abilities: (string | null)[];
  @Expose()
  @Column()
  @Field()
  public hiddenAbility: string
  @Expose()
  @Column()
  @Field(() => Color)
  public color: Color;
  @Expose()
  @Column()
  @Field(() => Int)
  public friendship: number;
  @Expose()
  @Column()
  @Field()
  public height: string;
  @Expose()
  @Column()
  @Field()
  public weight: string;
  @Expose()
  @Column()
  @Field(() => Int)
  public captureRate: number;
  @Expose()
  @Column()
  @Field(() => [Gender])
  public gender: Gender[];
  @Expose()
  @Column()
  @Field({ nullable:true }) 
  public form: string 
  @Expose()
  @Column()
  @Field(() => [PokemonOfWiki])
  public differentForm?: PokemonOfWiki[] 
  @Expose()
  @Column()
  @Field(() => Float)
  public createdAt?: number;
  @Expose()
  @Column()
  @Field(() => Int)
  public searchCount?: number;

  constructor(pokemon: Partial<PokemonOfWiki>) {
    if (pokemon?.no) {
      Object.assign(this, plainToClass(PokemonOfWiki, pokemon, { excludeExtraneousValues: true }));
      this._id = this._id ?? v4();
      this.createdAt = this.createdAt ?? +new Date();
      this.searchCount = this.searchCount ?? 0;
    }
  }
}