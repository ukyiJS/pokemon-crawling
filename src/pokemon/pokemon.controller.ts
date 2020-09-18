import { Controller, Get } from '@nestjs/common';
import { IEvolutionChain } from './pokemon.interface';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('evolutionChainByLevel')
  public getEvolutionChainByLevel(): Promise<IEvolutionChain[]> {
    return this.pokemonService.getEvolutionChainByLevel();
  }

  @Get('evolutionChainByElementalStone')
  public getEvolutionChainByElementalStone(): Promise<IEvolutionChain[]> {
    return this.pokemonService.getEvolutionChainByElementalStone();
  }

  @Get('evolutionChainByTrading')
  public getEvolutionChainByTrading(): Promise<IEvolutionChain[]> {
    return this.pokemonService.getEvolutionChainByTrading();
  }

  @Get('evolutionChainByFriendship')
  public getEvolutionChainByFriendship(): Promise<IEvolutionChain[]> {
    return this.pokemonService.getEvolutionChainByFriendship();
  }

  @Get('evolutionChainByOtherCondition')
  public getEvolutionChainByOtherCondition(): Promise<IEvolutionChain[]> {
    return this.pokemonService.getEvolutionChainByOtherCondition();
  }
}
