export const evolutionType = {
  LEVEL: 'level',
  STONE: 'stone',
  TRADE: 'trade',
  FRIENDSHIP: 'friendship',
  STATUS: 'status',
} as const;
export type EvolutionType = typeof evolutionType[keyof typeof evolutionType];
