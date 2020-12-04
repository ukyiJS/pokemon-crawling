import { ConvertModule, PuppeteerModule } from '@/utils';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlingModule } from './crawling/crawling.module';
import { PokemonDatabase } from './model/pokemonDatabase.entity';
import { PokemonWiki } from './model/pokemonWiki.entity';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import * as resolvers from './resolvers';

@Module({
  providers: [PokemonService, ...Object.values(resolvers)],
  imports: [TypeOrmModule.forFeature([PokemonWiki, PokemonDatabase]), PuppeteerModule, ConvertModule, CrawlingModule],
  controllers: [PokemonController],
})
export class PokemonModule {}
