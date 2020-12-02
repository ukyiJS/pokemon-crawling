export enum ConditionTypes {
  LEVEL = 'level',
  USE = 'use',
  TRADE = 'trade',
  FRIENDSHIP = 'friendship',
  OTHER = 'other',
}
export type ConditionType = typeof ConditionTypes[keyof typeof ConditionTypes];
