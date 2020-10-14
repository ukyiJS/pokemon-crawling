import { IPokemon, IWindow } from '@/pokemon/pokemon.interface';
import { DifferentForm } from './differentForm';
import { PokemonType } from './pokemonType';

declare let window: IWindow;

export class Pokedex {
  public crawling = ($elements: Element[]): IPokemon[] => {
    return Array.from($elements).reduce<IPokemon[]>((acc, $tr) => {
      const pokemon = window.getPokemonInfo($tr);
      const fromIndex = acc.findIndex(({ no }) => no === pokemon.no);
      const isFromPokemon = fromIndex > -1;
      const isPartnerPokemon = /partner/i.test(pokemon.form ?? '');
      const isFromPokemonWithoutForm = isFromPokemon && !pokemon.form;
      const isFromPokemonWithForm = isFromPokemon && pokemon.form;

      if (isPartnerPokemon || isFromPokemonWithoutForm) return acc;

      return isFromPokemonWithForm ? window.addFromDifferentForm(acc, fromIndex, pokemon) : [...acc, { ...pokemon }];
    }, []);
  };

  public convertIntoKor(pokemons: IPokemon[]): IPokemon[] {
    const { convertFormIntoKor } = new DifferentForm();
    const { convertTypesIntoKor } = new PokemonType();
    return pokemons.map(pokemon => convertFormIntoKor(convertTypesIntoKor(pokemon)));
  }
}
