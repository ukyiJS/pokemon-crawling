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
  public crawlingPokemonWiki(): Promise<IPokemonWiki[]> {
    return this.pokemonService.crawlingPokemonWiki();
  }

  @Get('pokemonDatabase')
  public crawlingPokemonDatabase(): Promise<IPokemonDatabase[]> {
    return this.pokemonService.crawlingPokemonDatabase();
  }

  @Get('pokemonImageOfSerebiiNet')
  public crawlingPokemonImageOfSerebiiNet(): Promise<SerebiiNet[]> {
    return this.pokemonService.crawlingPokemonImageOfSerebiiNet();
  }

  @Get('pokemonIconImageOfSerebiiNet')
  public crawlingPokemonIconImagOfSerebiiNet(): Promise<SerebiiNet[]> {
    return this.pokemonService.crawlingPokemonIconImageOfSerebiiNet();
  }
}
