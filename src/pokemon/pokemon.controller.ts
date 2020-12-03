import { WriteJsonInterceptor } from '@/common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { IPokemonDatabase } from './interfaces/pokemonDatabase.interface';
import { IPokemonWiki } from './interfaces/pokemonWiki.interface';
import { SerebiiNet } from './model/serebiiNet.entity';
import { PokemonService } from './pokemon.service';

@UseInterceptors(WriteJsonInterceptor)
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('pokemonWiki')
  public getPokemonWiki(): Promise<IPokemonWiki[]> {
    return this.pokemonService.getPokemonWiki();
  }

  @Get('pokemonDatabase')
  public getPokemonDatabase(): Promise<IPokemonDatabase[]> {
    return this.pokemonService.getPokemonDatabase();
  }

  @Get('pokemonImageOfSerebiiNet')
  public getPokemonImageSerebiiNet(): Promise<SerebiiNet[]> {
    return this.pokemonService.getPokemonImageOfSerebiiNet();
  }

  @Get('pokemonIconImageOfSerebiiNet')
  public getPokemonIconImageSerebiiNet(): Promise<SerebiiNet[]> {
    return this.pokemonService.getPokemonIconImagOfSerebiiNet();
  }
}
