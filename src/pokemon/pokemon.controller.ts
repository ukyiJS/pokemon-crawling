import { WriteJsonInterceptor } from '@/common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { IPokemon, IPokemonsOfDatabase, IPokemonsOfWiki } from './pokemon.interface';
import { PokemonService } from './pokemon.service';

@UseInterceptors(WriteJsonInterceptor)
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('evolutionChainByLevel')
  public getEvolutionChainByLevel(): Promise<IPokemon[]> {
    return this.pokemonService.getEvolutionChainByLevel();
  }

  @Get('evolutionChainByElementalStone')
  public getEvolutionChainByElementalStone(): Promise<IPokemon[]> {
    return this.pokemonService.getEvolutionChainByElementalStone();
  }

  @Get('evolutionChainByTrading')
  public getEvolutionChainByTrading(): Promise<IPokemon[]> {
    return this.pokemonService.getEvolutionChainByTrading();
  }

  @Get('evolutionChainByFriendship')
  public getEvolutionChainByFriendship(): Promise<IPokemon[]> {
    return this.pokemonService.getEvolutionChainByFriendship();
  }

  @Get('evolutionChainByOtherCondition')
  public getEvolutionChainByOtherCondition(): Promise<IPokemon[]> {
    return this.pokemonService.getEvolutionChainByOtherCondition();
  }

  @Get('pokedex')
  public getPokedex(): Promise<IPokemon[]> {
    return this.pokemonService.getPokedex();
  }

  @Get('pokemonsOfWiki')
  public getPokemonWiki(): Promise<IPokemonsOfWiki[]> {
    return this.pokemonService.getPokemonsOfWiki();
  }

  @Get('pokemonsOfDatabase')
  public getPokemonsOfDatabase(): Promise<IPokemonsOfDatabase[]> {
    return this.pokemonService.getPokemonsOfDatabase();
  }

  @Get('mergedEvolutionChains')
  public mergeEvolutionChains(): IPokemon[] {
    return this.pokemonService.mergeEvolutionChains();
  }

  @Get('mergedPokedexAndEvolutionChains')
  public mergePokedexAndEvolutionChains(): IPokemon[] {
    return this.pokemonService.mergePokedexAndEvolutionChains();
  }
}
