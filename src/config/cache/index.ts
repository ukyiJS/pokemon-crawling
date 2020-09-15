import { Injectable, CacheOptionsFactory, CacheModuleOptions } from '@nestjs/common';

@Injectable()
export class CacheService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return { ttl: 5, max: 10 };
  }
}
