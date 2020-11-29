import { WriteJsonInterceptor } from '@/common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { IPokemonImage, IPokemonOfDatabase, IPokemonOfWiki } from './pokemon.interface';
import { PokemonService } from './pokemon.service';

@UseInterceptors(WriteJsonInterceptor)
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('pokemonsOfWiki')
  public getPokemonWiki(): Promise<IPokemonOfWiki[]> {
    return this.pokemonService.getPokemonsOfWiki();
  }

  @Get('pokemonsOfDatabase')
  public getPokemonsOfDatabase(): Promise<IPokemonOfDatabase[]> {
    return this.pokemonService.getPokemonsOfDatabase();
  }

  @Get('mergedPokemon')
  public getMergedPokemon(): IPokemonOfDatabase[] {
    return this.pokemonService.getMergedPokemon();
  }

  @Get('pokemonIconImagesOfSerebiiNet')
  public getPokemonIconImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    return this.pokemonService.getPokemonIconImagesOfSerebiiNet();
  }

  @Get('pokemonImagesOfSerebiiNet')
  public getPokemonImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    return this.pokemonService.getPokemonImagesOfSerebiiNet();
  }
}
