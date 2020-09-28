import { IEvolvingTo, IPokemon } from '../pokemon.interface';
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

  private deepConvertTypes = (pokemon: IPokemon): IPokemon | IEvolvingTo => ({
    ...pokemon,
    types: this.getTypes(pokemon.types),
    evolvingTo: pokemon.evolvingTo.map(this.deepConvertTypes) as IEvolvingTo[],
    differentForm: pokemon.differentForm.map(this.deepConvertTypes),
  });
}
