import { writeJson } from '@/utils';
import { Injectable } from '@nestjs/common';
import { EvolutionType, getEvolutionChains } from './evolutionChains';
import { IEvolutionChain } from './pokemon.interface';

@Injectable()
export class PokemonService {
  public async getEvolutionChainByLevel(): Promise<IEvolutionChain[]> {
    const evolutionChainByLevel = await getEvolutionChains(EvolutionType.LEVEL);
    writeJson({ data: evolutionChainByLevel, fileName: 'evolutionChainByLevel', dirName: 'src/assets/json' });

    return evolutionChainByLevel;
  }

  public async getEvolutionChainByElementalStone(): Promise<IEvolutionChain[]> {
    const evolutionChainByElementalStone = await getEvolutionChains(EvolutionType.STONE);
    writeJson({
      data: evolutionChainByElementalStone,
      fileName: 'evolutionChainByElementalStone',
      dirName: 'src/assets/json',
    });

    return evolutionChainByElementalStone;
  }

  public async getEvolutionChainByTrading(): Promise<IEvolutionChain[]> {
    const evolutionChainByTrading = await getEvolutionChains(EvolutionType.TRADE);
    writeJson({ data: evolutionChainByTrading, fileName: 'evolutionChainByTrading', dirName: 'src/assets/json' });

    return evolutionChainByTrading;
  }

  public async getEvolutionChainByFriendship(): Promise<IEvolutionChain[]> {
    const evolutionChainByFriendship = await getEvolutionChains(EvolutionType.FRIENDSHIP);
    writeJson({ data: evolutionChainByFriendship, fileName: 'evolutionChainByFriendship', dirName: 'src/assets/json' });

    return evolutionChainByFriendship;
  }

  public async getEvolutionChainByOtherCondition(): Promise<IEvolutionChain[]> {
    const evolutionChainByOtherCondition = await getEvolutionChains(EvolutionType.STATUS);
    writeJson({
      data: evolutionChainByOtherCondition,
      fileName: 'evolutionChainByOtherCondition',
      dirName: 'src/assets/json',
    });

    return evolutionChainByOtherCondition;
  }
}
