export const eggGroupName = {
  MONSTER: '괴수',
  WATER: '수중',
  BUG: '벌레',
  FLYING: '비행',
  FIELD: '육상',
  FAIRY: '요정',
  GRASS: '식물',
  HUMAN_LIKE: '인간형',
  MINERAL: '광물',
  AMORPHOUS: '부정형',
  DITTO: '메타몽',
  DRAGON: '드래곤',
  UNDISCOVERED: '미발견',
} as const;
export type EggGroupName = typeof eggGroupName[keyof typeof eggGroupName];
