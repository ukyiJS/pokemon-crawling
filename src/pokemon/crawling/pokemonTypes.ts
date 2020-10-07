import { IPokemon } from '../pokemon.interface';
import { POKEMON_TYPE } from '../pokemon.type';

export class PokemonTypes {
  public convertTypesIntoKor = (pokemon: IPokemon): IPokemon => {
    return this.deepConvertTypes(pokemon);
  };

  private getTypes = (types?: string[]): string[] | undefined => {
    return types?.map(type => {
      const hasType = (key: string) => new RegExp(key, 'i').test(type);
      const key = Object.keys(POKEMON_TYPE).find(hasType);
      return POKEMON_TYPE[key as keyof typeof POKEMON_TYPE];
    });
  };

  private deepConvertTypes = <T extends IPokemon>(pokemon: T): T => ({
    ...pokemon,
    types: this.getTypes(pokemon.types),
    evolvingTo: pokemon.evolvingTo.map(this.deepConvertTypes),
    differentForm: pokemon.differentForm.map(this.deepConvertTypes),
  });
}
