import { GraphqlService, TypeormService } from '@/config';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { LoggingInterceptor, TimeoutInterceptor } from './common';
import { HttpExceptionFilter } from './common/filters/httpExceptionFilter';
import { DateScalar } from './config/graphql/scalars/date.scalar';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  providers: [
    DateScalar,
    AppResolver,
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
  ],
  imports: [
    GraphQLModule.forRootAsync({ useClass: GraphqlService }),
    TypeOrmModule.forRootAsync({ useClass: TypeormService }),
    PokemonModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
