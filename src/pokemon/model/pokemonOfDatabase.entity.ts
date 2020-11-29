import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { v4 } from 'uuid';
import { IPokemonOfDatabase } from '../pokemon.interface';
import { DifferentForm } from './differentForm.entity';
import { EggCycle } from './eggCycle.entity';
import { EvolvingTo } from './evolvingTo.entity';
import { Gender } from './gender.entity';
import { Stat } from './stat.entity';
import { TypeDefense } from './typeDefense.entity';

@Entity()
@ObjectType()
export class PokemonOfDatabase implements IPokemonOfDatabase {
  @Expose()
  @ObjectIdColumn()
  @Field()
  public _id?: string;
  @Expose()
  @Column({ unique: true })
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
  @Field({ nullable: true })
  public icon?: string;
  @Expose()
  @Column()
  @Field(() => [Stat])
  public stats: Stat[];
  @Expose()
  @Column()
  @Field(() => [String])
  public types: string[];
  @Expose()
  @Column()
  @Field(() => [TypeDefense])
  public typeDefenses: TypeDefense[];
  @Expose()
  @Column()
  @Field()
  public species: string;
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
  @Field(() => [String])
  public abilities: (string | null)[];
  @Expose()
  @Column()
  @Field({ nullable: true })
  public hiddenAbility: string;
  @Expose()
  @Column()
  @Field({ nullable: true })
  public evYield: string;
  @Expose()
  @Column()
  @Field(() => Int)
  public catchRate: number;
  @Expose()
  @Column()
  @Field(() => Int)
  public friendship: number;
  @Expose()
  @Column()
  @Field(() => Int)
  public exp: number;
  @Expose()
  @Column()
  @Field(() => [String])
  public eegGroups: string[];
  @Expose()
  @Column()
  @Field(() => [Gender])
  public gender: Gender[];
  @Expose()
  @Column()
  @Field(() => EggCycle)
  public eggCycle: EggCycle;
  @Expose()
  @Column()
  @Field({ nullable: true })
  public form: string;
  @Expose()
  @Column()
  @Field(() => [EvolvingTo])
  public evolvingTo: EvolvingTo[];
  @Expose()
  @Column()
  @Field(() => [DifferentForm])
  public differentForm?: DifferentForm[];
  @Expose()
  @Column()
  @Field(() => Float)
  public createdAt: number;
  @Expose()
  @Column()
  @Field(() => Int)
  public searchCount: number;

  constructor(pokemon: Partial<PokemonOfDatabase>) {
    if (pokemon?.no) {
      Object.assign(this, plainToClass(PokemonOfDatabase, pokemon, { excludeExtraneousValues: true }));
      this._id = this._id ?? v4();
      this.createdAt = this.createdAt ?? +new Date();
      this.searchCount = this.searchCount ?? 0;
    }
  }
}
