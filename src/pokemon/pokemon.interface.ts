import {
  ADDITIONAL_CONDITION,
  ELEMENTAL_STONE_CONDITION,
  EXCEPTIONAL_CONDITION,
  FRIENDSHIP_CONDITION,
  LEVEL_CONDITION,
  OTHER_CONDITION,
  TRADING_CONDITION,
} from './pokemon.type';

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
  LEVEL_CONDITION: LEVEL_CONDITION;
  ELEMENTAL_STONE_CONDITION: ELEMENTAL_STONE_CONDITION;
  TRADING_CONDITION: TRADING_CONDITION;
  FRIENDSHIP_CONDITION: FRIENDSHIP_CONDITION;
  OTHER_CONDITION: OTHER_CONDITION;
  ADDITIONAL_CONDITION: ADDITIONAL_CONDITION;
  EXCEPTIONAL_CONDITION: EXCEPTIONAL_CONDITION;
}
