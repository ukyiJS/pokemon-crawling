import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonDatabase } from './model/pokemonDatabase.entity';
import { PokemonWiki } from './model/pokemonWiki.entity';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import * as resolvers from './resolvers';

@Module({
  providers: [PokemonService, ...Object.values(resolvers)],
  imports: [TypeOrmModule.forFeature([PokemonWiki, PokemonDatabase])],
  controllers: [PokemonController],
  exports: [PokemonService],
})
export class PokemonModule {}
