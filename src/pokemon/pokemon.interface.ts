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

export interface IColor {
  name: string;
  code: string;
}

export interface IGenderRatio {
  name: string;
  ratio: number;
}

export interface IPokemonWiki {
  no: string;
  name: string;
  engName: string;
  image: string;
  types: string[];
  species: string;
  abilities: string[];
  hiddenAbility: string | null;
  color: IColor;
  friendship: number;
  height: string;
  weight: string;
  captureRate: number;
  genderRatio: IGenderRatio[];
  form: string | null;
  megaStone?: string;
  differentForm: IPokemonWiki[];
}

interface IMove {
  name: string;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
}

export interface IMoves {
  level: (IMove & { value: number | null })[];
  egg: IMove[];
  tm: (IMove & { no: number })[];
  tr: (IMove & { no: number })[];
}

export interface ITypeDefense {
  type: string;
  damage: number;
}

export interface IEggCycle {
  cycle: string;
  step: string;
}

export interface IPokemonSimpleInfo {
  no: string;
  name: string;
  image: string;
  stats: IStats[];
  types: string[];
  typeDefenses: ITypeDefense[];
  species: string;
  height: string;
  weight: string;
  abilities: string[];
  hiddenAbility: string;
  evYield: string;
  catchRate: number;
  friendship: number;
  exp: number;
  moves: IMoves;
  eegGroups: string[];
  gender: string[];
  eggCycles: IEggCycle;
}
