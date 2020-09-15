import { getBrowserAndPage } from '@/utils';
import { Injectable } from '@nestjs/common';
import { getEvolutionChainByLevel, IEvolutionChain } from './evolution';

@Injectable()
export class PokemonService {
  public async getEvolutionChanByLevel(): Promise<IEvolutionChain[]> {
    const url = 'https://pokemondb.net/evolution/level';
    const waitForSelector = '#evolution > tbody';
    const { browser, page } = await getBrowserAndPage(url, waitForSelector);

    const result = await getEvolutionChainByLevel(page);
    await browser.close();

    return result;
  }
}
