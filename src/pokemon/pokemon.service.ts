import { getJson, mergeJson } from '@/utils';
import { Injectable } from '@nestjs/common';
import { readdirSync } from 'fs';
import { join } from 'path';
import { EvolutionType, getEvolutionChains } from './evolutionChains';
import { IEvolutionChain, IPokemonNames } from './pokemon.interface';

@Injectable()
export class PokemonService {
  public getEvolutionChainByLevel(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.LEVEL);
  }

  public getEvolutionChainByElementalStone(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.STONE);
  }

  public getEvolutionChainByTrading(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.TRADE);
  }

  public getEvolutionChainByFriendship(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.FRIENDSHIP);
  }

  public getEvolutionChainByOtherCondition(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.STATUS);
  }

  public getPokemonWithoutEvolutions(): Promise<IEvolutionChain[]> {
    return getEvolutionChains(EvolutionType.NONE);
  }

  public mergeEvolutionChains(): IEvolutionChain[] {
    const dir = join(process.cwd(), 'src/assets/json');
    const fileNames = readdirSync(dir).filter(name => /^evolutionChainBy/gi.test(name));
    const mergedJson = mergeJson<IEvolutionChain>({ fileNames });

    const pokemons = getJson<IPokemonNames[]>({ fileName: 'pokemonWiki.json' });
    const getPokemon = (evolution: IEvolutionChain): IEvolutionChain => ({
      ...evolution,
      ...pokemons
        .map(({ no, name, engName, types }) => ({ no, name, engName, types }))
        .find(p => new RegExp(p.engName).test(evolution.name)),
      evolvingTo: evolution.evolvingTo?.map(e => getPokemon(e as IEvolutionChain)),
    });

    return mergedJson
      .flat()
      .map(getPokemon)
      .sort((a, b) => +a.no! + +!!a.differentForm - (+b.no! + +!!b.differentForm));
  }
}
