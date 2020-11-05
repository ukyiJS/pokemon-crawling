export const stoneCondition = {
  THUNDER_STONE: '천둥의돌',
  ICE_STONE: '얼음의돌',
  MOON_STONE: '달의돌',
  FIRE_STONE: '불꽃의돌',
  LEAF_STONE: '리프의돌',
  SUN_STONE: '태양의돌',
  WATER_STONE: '물의돌',
  GALARICA_CUFF: '가라두구팔찌',
  GALARICA_WREATH: '가라두구머리장식',
  SHINY_STONE: '빛의돌',
  DUSK_STONE: '어둠의돌',
  DAWN_STONE: '각성의돌',
  TART_APPLE: '새콤한 사과',
  SWEET_APPLE: '달콤한 사과',
  CRACKED_POT: '깨진 포트 or 이빠진 포트',
} as const;
export type StoneCondition = typeof stoneCondition[keyof typeof stoneCondition];
