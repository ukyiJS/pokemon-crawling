export interface IWindow extends Window {
  [key: string]: any;
  getPokemonInfo: (element: Element) => IEvolutionChain;
  getEvolvingTo: (element: Element, to: IEvolutionChain, type: string) => IEvolvingTo;
  addFromEvolvingTo: (acc: IEvolutionChain[], index: number, chain: IEvolutionChain) => IEvolutionChain[];
  addMultipleEvolvingTo: (acc: IEvolutionChain[], index: number, evolvingTo: IEvolvingTo) => IEvolutionChain[];
  addFromDifferentForm: (acc: IEvolutionChain[], index: number, chain: IEvolutionChain) => IEvolutionChain[];
}

export interface IEvolvingTo extends IEvolutionChain {
  type: string;
  level: string | null;
  condition: string | null;
}

export interface IEvolutionChain {
  name: string;
  image: string;
  form: string | null;
  evolvingTo: IEvolvingTo[];
  differentForm: IEvolutionChain[];
}
