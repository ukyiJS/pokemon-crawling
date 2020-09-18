import { getJson, mergeJson, writeJson } from '@/utils';
import { Injectable } from '@nestjs/common';
import { EvolutionType, getEvolutionChains } from './evolutionChains';
import { IEvolutionChain, IPokemonNames } from './pokemon.interface';

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

  public mergeEvolutionChainJson(): IEvolutionChain[] {
    const mergedJson = mergeJson<IEvolutionChain>({
      fileNames: [
        'evolutionChainByElementalStone.json',
        'evolutionChainByFriendship.json',
        'evolutionChainByLevel.json',
        'evolutionChainByOtherCondition.json',
        'evolutionChainByTrading.json',
      ],
    });
    const pokemons = getJson<IPokemonNames[]>({ fileName: 'pokemonWiki.json' }).map(({ no, name, engName, types }) => ({
      no,
      name,
      engName,
      types,
    }));
    const getPokemon = (evolution: IEvolutionChain): IEvolutionChain => ({
      ...evolution,
      ...pokemons.find(p => new RegExp(p.engName).test(evolution.name)),
      evolvingTo: evolution.evolvingTo?.map(e => getPokemon(e as IEvolutionChain)),
    });

    return mergedJson
      .flat()
      .map(getPokemon)
      .sort((a, b) => +a.no! + +!!a.differentForm - (+b.no! + +!!b.differentForm));
  }
}
