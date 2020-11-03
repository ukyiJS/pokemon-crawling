import {
  AdditionalCondition,
  ElementalStoneCondition,
  ExceptionalCondition,
  FriendshipCondition,
  LevelCondition,
  OtherCondition,
  TradingCondition,
} from './pokemon.type';

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

export interface IPokemonOfDatabase {
  no: string;
  name: string;
  engName: string;
  image: string;
  stats: IStat[];
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
  eegGroups: string[];
  gender: IGender[];
  eggCycles: IEggCycle;
  form: string | null;
  differentForm: IPokemonOfDatabase[];
}

export interface IEvolvingTo extends IEvolution {
  type: string;
  condition: string | null;
  additionalCondition: string | null;
}

export interface IEvolution {
  no: string;
  name: string;
  image: string;
  form: string | null;
  evolvingTo: IEvolvingTo[];
  differentForm: IEvolution[];
}

export interface IConditions {
  levelCondition: LevelCondition;
  elementalStoneCondition: ElementalStoneCondition;
  tradingCondition: TradingCondition;
  friendshipCondition: FriendshipCondition;
  otherCondition: OtherCondition;
  additionalCondition: AdditionalCondition;
  exceptionalCondition: ExceptionalCondition;
}

export interface IPokemonImage {
  no: string;
  name: string;
  image: string;
}
