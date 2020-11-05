export const statName = {
  HP: 'HP',
  ATTACK: '공격',
  DEFENSE: '방어',
  SP_ATTACK: '특수공격',
  SP_DEFENSE: '특수방어',
  SPEED: '스피드',
  TOTAL: '총합',
} as const;
export type StatName = typeof statName[keyof typeof statName];
