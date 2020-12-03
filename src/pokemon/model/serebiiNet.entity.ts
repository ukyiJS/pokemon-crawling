import { ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { v4 } from 'uuid';
import { IDatabaseColumn } from '../interfaces/databaseColumn.interface';
import { ISerebiiNet } from '../interfaces/serebiiNet.interface';
import { LanguageType } from '../types/language.type';
import { SerebiiNetType } from '../types/serebiiNet.type';

@Entity()
@ObjectType({ implements: () => [IDatabaseColumn, ISerebiiNet] })
export class SerebiiNet implements IDatabaseColumn, ISerebiiNet {
  @Expose()
  @Column()
  public _id?: string;
  @Expose()
  @Column()
  public no: string;
  @Expose()
  @Column()
  public name: LanguageType;
  @Expose()
  @Column()
  public image: string;
  @Expose()
  @Column()
  public form?: string | null;
  @Expose()
  @Column()
  public differentForm?: SerebiiNetType[];
  @Expose()
  @Column()
  public createdAt?: Date;
  @Expose()
  @Column()
  public searchCount?: number;

  constructor(pokemon: Partial<SerebiiNet>) {
    if (pokemon?.no) {
      Object.assign(this, plainToClass(SerebiiNet, pokemon, { excludeExtraneousValues: true }));
      this._id = this._id ?? v4();
      this.createdAt = this.createdAt ?? new Date();
      this.searchCount = this.searchCount ?? 0;
    }
  }
}
