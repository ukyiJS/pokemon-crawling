import { MONGODB_URL } from '@/env';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'mongodb',
      url: MONGODB_URL,
      entities: [join(__dirname, '../../', '**/**.entity{.ts,.js}')],
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: true,
    };
  }
}
