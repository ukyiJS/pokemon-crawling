import { additionalCondition, AdditionalCondition } from './type/additionalCondition';
import { EvolutionType } from './type/evolutionType';
import { friendshipCondition, FriendshipCondition } from './type/friendshipCondition';
import { levelCondition, LevelCondition } from './type/levelCondition';
import { otherCondition, OtherCondition } from './type/otherCondition';
import { stoneCondition, StoneCondition } from './type/stoneCondition';
import { tradeCondition, TradeCondition } from './type/tradeCondition';

export * from './type/abilityName';
export * from './type/differentFormName';
export * from './type/eggGroupName';
export * from './type/evolutionType';
export * from './type/functionString';
export * from './type/pokemonName';
export * from './type/pokemonTypeName';
export * from './type/statName';
export {
  levelCondition,
  LevelCondition,
  stoneCondition,
  StoneCondition,
  tradeCondition,
  TradeCondition,
  friendshipCondition,
  FriendshipCondition,
  otherCondition,
  OtherCondition,
  additionalCondition,
  AdditionalCondition,
};

export const exceptionalCondition = [
  'outside',
  'in Ultra Sun/Moon',
  'or level up with max Beauty',
  '400 Meltan Candies',
  'knowing Fairy move',
] as const;
export type ExceptionalCondition = typeof exceptionalCondition;

export const exceptionalAbilityName = [
  'Thick Fat',
  'Levitate',
  'Storm Drain',
  'Lightning Rod',
  'Motor Drive',
  'Sap Sipper',
  'Dry Skin',
  'Water Absorb',
  'Volt Absorb',
  'Flash Fire',
  'Fluffy',
] as const;
export type ExceptionalAbilityName = typeof exceptionalAbilityName;

export type ConditionType =
  | typeof levelCondition
  | typeof stoneCondition
  | typeof tradeCondition
  | typeof friendshipCondition
  | typeof otherCondition
  | typeof additionalCondition;

export type ConditionParam = {
  conditionType: ConditionType;
  evolutionType: EvolutionType;
  additionalCondition: typeof additionalCondition;
  exceptionalCondition: ExceptionalCondition;
};
export const conditions = {
  levelCondition,
  stoneCondition,
  tradeCondition,
  friendshipCondition,
  otherCondition,
  additionalCondition,
  exceptionalCondition,
} as const;
export type Conditions = typeof conditions;
