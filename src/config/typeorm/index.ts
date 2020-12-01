import { MONGODB_URL } from '@/env';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  public async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'mongodb',
      url: MONGODB_URL,
      entities: getMetadataArgsStorage().tables.map(({ target }) => target),
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: true,
    };
  }
}
