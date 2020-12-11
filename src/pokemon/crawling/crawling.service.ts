import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Page } from 'puppeteer-extra/dist/puppeteer';
import { IPokemonDatabase } from '../interfaces/pokemonDatabase.interface';
import { IPokemonWiki } from '../interfaces/pokemonWiki.interface';
import { ISerebiiNet } from '../interfaces/serebiiNet.interface';
import { CrawlingPokemonDatabase } from './pokemonDatabase';
import { CrawlingPokemonIconImageOfSerebiiNet } from './pokemonIconImageOfSerebiiNet';
import { CrawlingPokemonImageOfSerebiiNet } from './pokemonImageOfSerebiiNet';
import { CrawlingPokemonWiki } from './PokemonWiki';

@Injectable()
export class CrawlingService {
  private loopCount: number;

  constructor(private readonly configService: ConfigService) {
    this.loopCount = this.configService.get('crawling.loopCount') ?? 893;
  }

  public crawlingPokemonDatabase(page: Page, loopCount?: number): Promise<IPokemonDatabase[]> {
    return new CrawlingPokemonDatabase().crawling(page, loopCount ?? this.loopCount);
  }

  public crawlingPokemonWiki(page: Page, loopCount?: number): Promise<IPokemonWiki[]> {
    return new CrawlingPokemonWiki().crawling(page, loopCount ?? this.loopCount);
  }

  public crawlingPokemonImageOfSerebiiNet(page: Page, loopCount?: number): Promise<ISerebiiNet[]> {
    return new CrawlingPokemonImageOfSerebiiNet().crawling(page, loopCount ?? this.loopCount);
  }

  public crawlingPokemonIconImageOfSerebiiNet(page: Page): Promise<ISerebiiNet[]> {
    return new CrawlingPokemonIconImageOfSerebiiNet().crawling(page);
  }
}
