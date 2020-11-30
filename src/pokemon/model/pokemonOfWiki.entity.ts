import { ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { v4 } from 'uuid';
import { Color, DatabaseColumn, Gender, Pokemon, PokemonOfWiki } from '../pokemon.interface';

@Entity()
@ObjectType({ implements: () => [DatabaseColumn, Pokemon, PokemonOfWiki] })
export class PokemonOfWikiEntity implements DatabaseColumn, Pokemon, PokemonOfWiki {
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
  public color: Color;
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
  public gender: Gender[];
  @Expose()
  @Column()
  public form: string | null;
  @Expose()
  @Column()
  public differentForm?: PokemonOfWiki[];
  @Expose()
  @Column()
  public createdAt?: number;
  @Expose()
  @Column()
  public searchCount?: number;

  constructor(pokemon: Partial<PokemonOfWikiEntity>) {
    if (pokemon?.no) {
      Object.assign(this, plainToClass(PokemonOfWikiEntity, pokemon, { excludeExtraneousValues: true }));
      this._id = this._id ?? v4();
      this.createdAt = this.createdAt ?? +new Date();
      this.searchCount = this.searchCount ?? 0;
    }
  }
}
