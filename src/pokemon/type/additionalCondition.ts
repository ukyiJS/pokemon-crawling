export const additionalCondition = {
  IN_ALOLA: '알로라 지방에서',
  IN_GALAR: '가라르 지방에서',
  IN_GRASS: '풀숲에서',
  IN_CAVES: '동굴•사막•해안가에서',
  IN_BUILDINGS: '건물에서',
  POKEBALL_IN_BAG: '몬스터볼을 가지고 있는 상태에서',
  IN_POKEMON_SUN_OR_ULTRASUN: '썬, 울트라썬, 소드 버전에서',
  IN_POKEMON_MOON_OR_ULTRAMOON: '문, 울트라문, 실드 버전에서',
  MALE: '수컷일 때',
  FEMALE: '암컷일 때',
  IN_A_MAGNETIC_FIELD_AREA:
    '천관산(DPPt), 전기돌동굴(BW/BW2), 13번 도로-발전소가 있는 곳(XY), 뉴보라(ORAS), 포니대협곡(SM/USUM), 화끈산(USUM)에서',
  OR_LEVEL_UP_WITH_MAX_BEAUTY: '아름다움 컨디션이 170 이상일 때 레벨업 또는',
  NIGHTTIME: '밤에',
  DAYTIME: '낮에',
} as const;
export type AdditionalCondition = typeof additionalCondition[keyof typeof additionalCondition];
