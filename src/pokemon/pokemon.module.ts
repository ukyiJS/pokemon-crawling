import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonResolver } from './pokemon.resolver';
import { PokemonService } from './pokemon.service';

@Module({
  providers: [PokemonService, PokemonResolver],
  controllers: [PokemonController],
  exports: [PokemonService],
})
export class PokemonModule {}
