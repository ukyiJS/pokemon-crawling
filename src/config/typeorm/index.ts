import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'mongodb',
      url: this.configService.get('database.url'),
      entities: getMetadataArgsStorage().tables.map(({ target }) => target),
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      logging: true,
    };
  }
}
