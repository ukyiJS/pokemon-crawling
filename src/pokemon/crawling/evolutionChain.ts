import { EVOLUTION_TYPE } from '../pokemon.type';
import { IPokemon, IWindow } from '../pokemon.interface';
import { PokemonForm } from './pokemonForm';

declare let window: IWindow;

export class EvolutionChain {
  evolutionType: EVOLUTION_TYPE;

  constructor(evolutionType: EVOLUTION_TYPE) {
    this.evolutionType = evolutionType;
  }

  public crawling = ($elements: Element[], type: string): IPokemon[] =>
    $elements.reduce<IPokemon[]>((acc, $tr) => {
      const $cellNames = Array.from($tr.querySelectorAll('.cell-name'));
      const [from, to] = $cellNames.map(window.getPokemonInfo);
      const evolvingTo = window.getEvolvingTo($tr, to, type);
      const chain = { ...from, evolvingTo: [evolvingTo] };

      const fromEvolvingToIndex = acc.findIndex(p => p.evolvingTo.some(_p => _p.name === from.name));
      if (fromEvolvingToIndex > -1) return window.addFromEvolvingTo(acc, fromEvolvingToIndex, chain);

      const fromNameIndex = acc.findIndex(pokemon => pokemon.name === from.name);
      if (fromNameIndex > -1) {
        if (from.form) return window.addFromDifferentForm(acc, fromNameIndex, chain);
        return window.addMultipleEvolvingTo(acc, fromNameIndex, evolvingTo);
      }

      return [...acc, chain] as IPokemon[];
    }, []);

  public convertIntoKor = (evolutionChains: IPokemon[]): IPokemon[] => {
    const { convertFormIntoKor } = new PokemonForm(this.evolutionType);
    return evolutionChains.map(convertFormIntoKor);
  };
}
