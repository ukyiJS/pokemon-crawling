export interface IStat {
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

export interface IPokemonOfWiki {
  no: string;
  name: string;
  engName: string;
  image: string;
  types: string[];
  species: string;
  abilities: (string | null)[];
  hiddenAbility: string | null;
  color: IColor;
  friendship: number;
  height: string;
  weight: string;
  captureRate: number;
  gender: IGender[];
  form: string | null;
  differentForm?: IPokemonOfWiki[];
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
  value: number;
  step: number[] | null;
}

export interface IEvolvingTo {
  no: string;
  name: string;
  image: string;
  form: string | null;
  condition?: string;
  evolvingTo: IEvolvingTo[];
}

export interface IPokemonOfDatabase {
  no: string;
  name: string;
  image: string;
  stats: IStat[];
  types: string[];
  typeDefenses: ITypeDefense[];
  species: string;
  height: string;
  weight: string;
  abilities: (string | null)[];
  hiddenAbility: string | null;
  evYield: string | null;
  catchRate: number;
  friendship: number;
  exp: number;
  eegGroups: string[];
  gender: IGender[];
  eggCycle: IEggCycle | null;
  evolvingTo?: IEvolvingTo[];
  form: string | null;
  differentForm?: IPokemonOfDatabase[];
}

export interface IDifferentFormImage {
  image: string;
  form: string;
}

export interface IPokemonImage {
  no: string;
  name: string;
  image: string;
  form?: string | null;
  differentForm?: IDifferentFormImage[];
}
