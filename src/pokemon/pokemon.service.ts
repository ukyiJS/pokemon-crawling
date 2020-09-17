import { Injectable } from '@nestjs/common';
import { EvolutionType, getEvolutionChains, IEvolutionChain } from './evolutionChains';

@Injectable()
export class PokemonService {
  public getEvolutionChainByLevel(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.LEVEL);
  }

  public async getEvolutionChainByElementalStone(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.STONE);
  }

  public async getEvolutionChainByTrading(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.TRADE);
  }

  public async getEvolutionChainByFriendship(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.FRIENDSHIP);
  }

  public async getEvolutionChainByOtherCondition(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.STATUS);
  }
}
