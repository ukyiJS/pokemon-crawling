import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonOfDatabase } from './model/pokemonOfDatabase.entity';
import { PokemonOfWiki } from './model/pokemonOfWiki.entity';
import { PokemonController } from './pokemon.controller';
import { PokemonResolver } from './pokemon.resolver';
import { PokemonService } from './pokemon.service';

@Module({
  providers: [PokemonService, PokemonResolver],
  imports: [TypeOrmModule.forFeature([PokemonOfDatabase, PokemonOfWiki])],
  controllers: [PokemonController],
  exports: [PokemonService],
})
export class PokemonModule {}
