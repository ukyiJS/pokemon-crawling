import { Controller, Get } from '@nestjs/common';
import { IEvolutionChain } from './evolution';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('evolutionChainByLevel')
  public getEvolutionChanByLevel(): Promise<IEvolutionChain[]> {
    return this.pokemonService.getEvolutionChanByLevel();
  }
}
