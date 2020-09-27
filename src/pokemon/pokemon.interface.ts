export interface IWindow extends Window {
  [key: string]: any;
  getText: ($element: Element) => string;
  getTexts: ($elements: NodeListOf<Element> | Element[]) => string[];
  getPokemonInfo: (element: Element) => IPokemon;
  getEvolvingTo: (element: Element, to: IPokemon, type: string) => IEvolvingTo;
  addFromEvolvingTo: (acc: IPokemon[], index: number, chain: IPokemon) => IPokemon[];
  addMultipleEvolvingTo: (acc: IPokemon[], index: number, evolvingTo: IEvolvingTo) => IPokemon[];
  addFromDifferentForm: (acc: IPokemon[], index: number, chain: IPokemon) => IPokemon[];
  getStats: ($element: Element) => IStats[];
}

export interface IPokemon {
  no?: string;
  name: string;
  image: string;
  form: string | null;
  types?: string[];
  evolvingTo: IEvolvingTo[];
  differentForm: IPokemon[];
  stats?: IStats[];
}

export interface IEvolvingTo extends IPokemon {
  type: string;
  level: string | null;
  condition: string | null;
}

export interface IStats {
  name: string;
  value: number;
}
