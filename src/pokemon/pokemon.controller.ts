import { WriteJsonInterceptor } from '@/common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { FindAndModifyWriteOpResultObject } from 'typeorm';
import { IPokemonImage, IPokemonOfDatabase, IPokemonsOfWiki } from './pokemon.interface';
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

  @Get('pokemonIconImagesOfSerebiiNet')
  public getPokemonIconImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    return this.pokemonService.getPokemonIconImagesOfSerebiiNet();
  }

  @Get('pokemonImagesOfSerebiiNet')
  public getPokemonImagesOfSerebiiNet(): Promise<IPokemonImage[]> {
    return this.pokemonService.getPokemonImagesOfSerebiiNet();
  }
  @Get('downloadImages')
  public downloadImages(): Promise<void> {
    return this.pokemonService.downloadImages();
  }

  @Get('updateImage')
  public updateImage(): Promise<FindAndModifyWriteOpResultObject[]> {
    return this.pokemonService.updateImage();
  }
}
