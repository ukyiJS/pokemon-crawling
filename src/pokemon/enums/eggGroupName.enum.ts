export enum EggGroupNames {
  MONSTER = '괴수',
  WATER1 = '수중1',
  WATER2 = '수중2',
  WATER3 = '수중3',
  BUG = '벌레',
  FLYING = '비행',
  FIELD = '육상',
  FAIRY = '요정',
  GRASS = '식물',
  HUMAN_LIKE = '인간형',
  MINERAL = '광물',
  AMORPHOUS = '부정형',
  DITTO = '메타몽',
  DRAGON = '드래곤',
  UNDISCOVERED = '미발견',
}
export type EggGroupName = typeof EggGroupNames[keyof typeof EggGroupNames];
