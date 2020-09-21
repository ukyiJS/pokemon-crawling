import { mergeJson } from '@/utils';
import { Injectable } from '@nestjs/common';
import { readdirSync } from 'fs';
import { join } from 'path';
import { EvolutionType, getEvolutionChains } from './evolutionChains';
import { IEvolutionChain } from './pokemon.interface';

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
    const mergedJson = mergeJson<IEvolutionChain>({ fileNames })
      .flat()
      .reduce<IEvolutionChain[]>((acc, pokemon, i, arr) => {
        const hasPokemons = arr.filter(({ name }) => name === pokemon.name);
        if (hasPokemons.length > 1) {
          pokemon.evolvingTo = hasPokemons.map(({ evolvingTo }) => evolvingTo).flat();

          const uniqueNames = Array.from(new Set(pokemon.evolvingTo.map(({ name }) => name)));
          pokemon.evolvingTo = uniqueNames.map(name => ({ ...pokemon.evolvingTo.find(p => p.name === name)! }));
        }

        const preIndex = arr.findIndex(({ evolvingTo }) => evolvingTo.some(({ name }) => name === pokemon.name));
        if (preIndex > -1) {
          arr[preIndex].evolvingTo = arr[preIndex].evolvingTo.map(e => ({ ...e, evolvingTo: pokemon.evolvingTo }));
          return acc;
        }
        return [...acc, pokemon];
      }, []);

    const uniqueNames = Array.from(new Set(mergedJson.map(({ name }) => name)));
    return uniqueNames
      .map(name => ({ ...mergedJson.find(p => p.name === name && p.differentForm)! }))
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
  }
}
