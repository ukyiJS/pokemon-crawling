import { ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { v4 } from 'uuid';
import {
  DatabaseColumn,
  EggCycle,
  EvolvingTo,
  Gender,
  Pokemon,
  PokemonOfDatabase,
  Stat,
  TypeDefense,
} from '../pokemon.interface';

@Entity()
@ObjectType({ implements: () => [DatabaseColumn, Pokemon, PokemonOfDatabase] })
export class PokemonOfDatabaseEntity implements DatabaseColumn, Pokemon, PokemonOfDatabase {
  @Expose()
  @ObjectIdColumn({ type: 'uuid' })
  public _id?: string;
  @Expose()
  @Column({ unique: true })
  public no: string;
  @Expose()
  @Column()
  public name: string;
  @Expose()
  @Column()
  public image: string;
  @Expose()
  @Column()
  public icon?: string;
  @Expose()
  @Column()
  public stats: Stat[];
  @Expose()
  @Column()
  public types: string[];
  @Expose()
  @Column()
  public typeDefenses: TypeDefense[];
  @Expose()
  @Column()
  public species: string;
  @Expose()
  @Column()
  public height: string;
  @Expose()
  @Column()
  public weight: string;
  @Expose()
  @Column()
  public abilities: (string | null)[];
  @Expose()
  @Column()
  public hiddenAbility: string | null;
  @Expose()
  @Column()
  public evYield: string | null;
  @Expose()
  @Column()
  public catchRate: number;
  @Expose()
  @Column()
  public friendship: number;
  @Expose()
  @Column()
  public exp: number;
  @Expose()
  @Column()
  public eegGroups: string[];
  @Expose()
  @Column()
  public gender: Gender[];
  @Expose()
  @Column()
  public eggCycle: EggCycle | null;
  @Expose()
  @Column()
  public form: string | null;
  @Expose()
  @Column()
  public evolvingTo?: EvolvingTo[];
  @Expose()
  @Column()
  public differentForm?: PokemonOfDatabase[];
  @Expose()
  @Column()
  public createdAt?: number;
  @Expose()
  @Column()
  public searchCount?: number;

  constructor(pokemon: Partial<PokemonOfDatabaseEntity>) {
    if (pokemon?.no) {
      Object.assign(this, plainToClass(PokemonOfDatabaseEntity, pokemon, { excludeExtraneousValues: true }));
      this._id = this._id ?? v4();
      this.createdAt = this.createdAt ?? +new Date();
      this.searchCount = this.searchCount ?? 0;
    }
  }
}
