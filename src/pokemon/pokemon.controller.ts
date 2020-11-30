import { WriteJsonInterceptor } from '@/common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { IPokemonImage, PokemonOfDatabase, PokemonOfWiki } from './pokemon.interface';
import { PokemonService } from './pokemon.service';

@UseInterceptors(WriteJsonInterceptor)
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('pokemonsOfWiki')
  public getPokemonWiki(): Promise<PokemonOfWiki[]> {
    return this.pokemonService.getPokemonsOfWiki();
  }

  @Get('pokemonsOfDatabase')
  public getPokemonsOfDatabase(): Promise<PokemonOfDatabase[]> {
    return this.pokemonService.getPokemonsOfDatabase();
  }

  @Get('pokemonIconImagesOfSerebiiNet')
  public getPokemonIconImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    return this.pokemonService.getPokemonIconImageOfSerebiiNet();
  }

  @Get('pokemonImagesOfSerebiiNet')
  public getPokemonImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    return this.pokemonService.getPokemonImagesOfSerebiiNet();
  }
}
