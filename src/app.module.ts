import { GraphqlService, TypeormService } from '@/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({ useClass: GraphqlService }),
    TypeOrmModule.forRootAsync({ useClass: TypeormService }),
    PokemonModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
