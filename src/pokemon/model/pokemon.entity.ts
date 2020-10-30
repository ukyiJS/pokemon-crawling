import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { v4 } from 'uuid';
import { IPokemonOfDatabase } from '../pokemon.interface';
import { EggCycle } from './eggCycle.entity';
import { Gender } from './gender.entity';
import { Stats } from './stat.entity';
import { TypeDefense } from './typeDefense.entity';

@Entity()
@ObjectType()
export class PokemonOfDatabase implements IPokemonOfDatabase {
  @Expose()
  @ObjectIdColumn()
  @Field()
  _id: string;

  @Expose()
  @Column()
  @Field()
  no: string;

  @Expose()
  @Column()
  @Field()
  name: string;

  @Expose()
  @Column()
  @Field()
  engName: string;

  @Expose()
  @Column()
  @Field()
  image: string;

  @Expose()
  @Column()
  @Field(() => [Stats])
  stats: Stats[];

  @Expose()
  @Column()
  @Field()
  types: string[];

  @Expose()
  @Column()
  @Field(() => [TypeDefense])
  typeDefenses: TypeDefense[];

  @Expose()
  @Column()
  @Field()
  species: string;

  @Expose()
  @Column()
  @Field()
  height: string;

  @Expose()
  @Column()
  @Field()
  weight: string;

  @Expose()
  @Column()
  @Field()
  abilities: string[];

  @Expose()
  @Column()
  @Field({ nullable: true })
  hiddenAbility: string | null;

  @Expose()
  @Column()
  @Field({ nullable: true })
  evYield: string | null;

  @Expose()
  @Column()
  @Field(() => Int)
  catchRate: number;

  @Expose()
  @Column()
  @Field(() => Int)
  friendship: number;

  @Expose()
  @Column()
  @Field(() => Int)
  exp: number;

  @Expose()
  @Column()
  @Field()
  eegGroups: string[];

  @Expose()
  @Column()
  @Field(() => [Gender])
  gender: Gender[];

  @Expose()
  @Column()
  @Field(() => EggCycle)
  eggCycles: EggCycle;

  @Expose()
  @Column()
  @Field({ nullable: true })
  form: string | null;

  @Expose()
  @Column()
  @Field(() => [PokemonOfDatabase])
  differentForm: PokemonOfDatabase[];

  @Expose()
  @Column()
  @Field(() => Int)
  createdAt: number;

  @Expose()
  @Column()
  @Field(() => Int)
  searchCount: number;

  constructor(pokemon: Partial<PokemonOfDatabase>) {
    if (pokemon?.no) {
      Object.assign(this, plainToClass(PokemonOfDatabase, pokemon, { excludeExtraneousValues: true }));
      this._id = this._id ?? v4();
      this.createdAt = this.createdAt ?? +new Date();
      this.searchCount = this.searchCount ?? 0;
    }
  }
}
