import { Controller, Get } from '@nestjs/common';
import { IPokedex } from './pokedex/type';
import { IEvolutionChain } from './pokemon.interface';
import { PokemonService } from './pokemon.service';

// @UseInterceptors(WriteJsonInterceptor)
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('evolutionChainByLevel')
  public getEvolutionChainByLevel(): Promise<IEvolutionChain[]> {
    return this.pokemonService.getEvolutionChainByLevel();
  }

  @Get('pokedex')
  public getPokedex(): Promise<IPokedex[]> {
    return this.pokemonService.getPokedex();
  }
}
