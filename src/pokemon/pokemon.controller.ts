import { WriteJsonInterceptor } from '@/common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { IEvolution, IPokemonImage, IPokemonOfDatabase, IPokemonsOfWiki } from './pokemon.interface';
import { PokemonService } from './pokemon.service';

@UseInterceptors(WriteJsonInterceptor)
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('pokemonsOfWiki')
  public getPokemonWiki(): Promise<IPokemonsOfWiki[]> {
    return this.pokemonService.getPokemonsOfWiki();
  }

  @Get('pokemonsOfDatabase')
  public getPokemonsOfDatabase(): Promise<IPokemonOfDatabase[]> {
    return this.pokemonService.getPokemonsOfDatabase();
  }

  @Get('evolutionOfDatabase')
  public getEvolutionOfDatabase(): Promise<IEvolution[]> {
    return this.pokemonService.getEvolutionOfDatabase();
  }

  @Get('pokemonIconImagesOfSerebiiNet')
  public getPokemonIconImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    return this.pokemonService.getPokemonIconImagesOfSerebiiNet();
  }
}
