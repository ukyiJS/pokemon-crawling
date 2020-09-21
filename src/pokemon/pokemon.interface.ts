export interface IPokemonNames {
  no: string;
  name: string;
  engName: string;
  types: string[];
}

export interface IDifferentForm {
  name: string;
  image: string;
  form: string | null;
  evolvingTo: IEvolvingTo[];
}

export interface IPokemon {
  name: string;
  image: string;
  form: string | null;
  differentForm?: IDifferentForm[];
}

export interface IEvolvingTo extends IPokemon {
  type?: string;
  condition?: string[];
  evolvingTo: IEvolvingTo[];
}

export interface IEvolutionChain extends IPokemon {
  evolvingTo: IEvolvingTo[];
}
