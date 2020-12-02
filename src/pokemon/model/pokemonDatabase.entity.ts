import { ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { v4 } from 'uuid';
import { IDatabaseColumn } from '../interfaces/databaseColumn.interface';
import { IPokemon } from '../interfaces/pokemon.interface';
import { IPokemonDatabase } from '../interfaces/pokemonDatabase.interface';
import { EggCycleType } from '../types/eggCycle.type';
import { EvolvingToType } from '../types/evolvingTo.type';
import { GenderType } from '../types/gender.type';
import { PokemonDatabaseType } from '../types/pokemonDatabase.type';
import { StatType } from '../types/stat.type';
import { TypeDefenseType } from '../types/typeDefense.type';

@Entity()
@ObjectType({ implements: () => [IDatabaseColumn, IPokemon, IPokemonDatabase] })
export class PokemonDatabase implements IDatabaseColumn, IPokemon, IPokemonDatabase {
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
  public stats: StatType[];
  @Expose()
  @Column()
  public types: string[];
  @Expose()
  @Column()
  public typeDefenses: TypeDefenseType[];
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
  public evYield: string[] | null;
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
  public gender: GenderType[];
  @Expose()
  @Column()
  public eggCycle: EggCycleType | null;
  @Expose()
  @Column()
  public form: string | null;
  @Expose()
  @Column()
  public evolvingTo?: EvolvingToType[];
  @Expose()
  @Column()
  public differentForm?: PokemonDatabaseType[];
  @Expose()
  @Column()
  public createdAt?: Date;
  @Expose()
  @Column()
  public searchCount?: number;

  constructor(pokemon: Partial<PokemonDatabase>) {
    if (pokemon?.no) {
      Object.assign(this, plainToClass(PokemonDatabase, pokemon, { excludeExtraneousValues: true }));
      this._id = this._id ?? v4();
      this.createdAt = this.createdAt ?? new Date();
      this.searchCount = this.searchCount ?? 0;
    }
  }
}
