import { ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { v4 } from 'uuid';
import { IDatabaseColumn } from '../interfaces/databaseColumn.interface';
import { IPokemon } from '../interfaces/pokemon.interface';
import { IPokemonWiki } from '../interfaces/pokemonWiki.interface';
import { ColorType } from '../types/color.type';
import { GenderType } from '../types/gender.type';
import { PokemonWikiType } from '../types/pokemonWiki.type';

@Entity()
@ObjectType({ implements: () => [IDatabaseColumn, IPokemon, IPokemonWiki] })
export class PokemonWiki implements IDatabaseColumn, IPokemon, IPokemonWiki {
  @Expose()
  @ObjectIdColumn({ type: 'uuid' })
  public _id?: string;
  @Expose()
  @Column()
  public no: string;
  @Expose()
  @Column()
  public name: string;
  @Expose()
  @Column()
  public image: string;
  @Expose()
  @Column()
  public color: ColorType;
  @Expose()
  @Column()
  public types: string[];
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
  public catchRate: number;
  @Expose()
  @Column()
  public friendship: number;
  @Expose()
  @Column()
  public eegGroups: string[];
  @Expose()
  @Column()
  public gender: GenderType[];
  @Expose()
  @Column()
  public form: string | null;
  @Expose()
  @Column()
  public differentForm?: PokemonWikiType[];
  @Expose()
  @Column()
  public createdAt?: Date;
  @Expose()
  @Column()
  public searchCount?: number;

  constructor(pokemon: Partial<PokemonWiki>) {
    if (pokemon?.no) {
      Object.assign(this, plainToClass(PokemonWiki, pokemon, { excludeExtraneousValues: true }));
      this._id = this._id ?? v4();
      this.createdAt = this.createdAt ?? new Date();
      this.searchCount = this.searchCount ?? 0;
    }
  }
}
