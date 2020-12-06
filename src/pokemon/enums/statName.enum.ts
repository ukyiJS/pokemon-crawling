export enum StatNames {
  HP = '체력',
  ATTACK = '공격',
  DEFENSE = '방어',
  SPECIAL_ATTACK = '특수공격',
  SPECIAL_DEFENSE = '특수방어',
  SPEED = '스피드',
}
export type StatName = typeof StatNames[keyof typeof StatNames];
