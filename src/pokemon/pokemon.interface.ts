export interface IStats {
  name: string;
  value: number;
}

export interface IColor {
  name: string;
  code: string;
}

export interface IGender {
  name: string;
  ratio: number;
}

export interface IPokemonsOfWiki {
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
  gender: IGender[];
  form: string | null;
  megaStone?: string;
  differentForm: IPokemonsOfWiki[];
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
  cycle: number;
  step: string | null;
}

export interface IPokemonsOfDatabase {
  no: string;
  name: string;
  engName: string;
  image: string;
  stats: IStats[];
  types: string[];
  typeDefenses: ITypeDefense[];
  species: string;
  height: string;
  weight: string;
  abilities: string[];
  hiddenAbility: string | null;
  evYield: string | null;
  catchRate: number;
  friendship: number;
  exp: number;
  moves: IMoves;
  eegGroups: string[];
  gender: IGender[];
  eggCycles: IEggCycle;
  form: string | null;
  differentForm: IPokemonsOfDatabase[];
}
