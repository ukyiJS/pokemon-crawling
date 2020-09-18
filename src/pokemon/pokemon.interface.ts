export interface ISessionPokemon {
  [key: string]: any;
  pokemons: IPokemonNames[];
}

export interface IPokemonNames {
  no: string;
  name: string;
  engName: string;
  types: string[];
}

export interface IPokemon {
  name: string;
  image: string;
  differentForm: string | null;
}

export interface IEvolvingTo extends IPokemon {
  type?: string;
  condition?: string[];
}

export interface IEvolutionChain extends IPokemon {
  no?: string;
  engName?: string;
  types?: string[];
  image: string;
  differentForm: string | null;
  evolvingTo: IEvolvingTo[];
}
