import { WriteJsonInterceptor } from '@/common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { IPokedex } from './pokedex/type';
import { IEvolutionChain } from './pokemon.interface';
import { PokemonService } from './pokemon.service';

@UseInterceptors(WriteJsonInterceptor)
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

  @Get('pokemonWithoutEvolutions')
  public getPokemonWithoutEvolutions(): Promise<IEvolutionChain[]> {
    return this.pokemonService.getPokemonWithoutEvolutions();
  }

  @Get('mergedEvolutionChains')
  public mergeEvolutionChains(): IEvolutionChain[] {
    return this.pokemonService.mergeEvolutionChains();
  }

  @Get('pokedex')
  public getPokedex(): Promise<IPokedex[]> {
    return this.pokemonService.getPokedex();
  }
}
