import { GraphqlService, TypeormService } from '@/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { PokemonController } from './pokemon/pokemon.controller';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({ useClass: GraphqlService }),
    TypeOrmModule.forRootAsync({ useClass: TypeormService }),
    PokemonModule,
  ],
  controllers: [AppController, PokemonController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
