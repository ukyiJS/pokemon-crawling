export enum LevelAdditionalConditionNames {
  NIGHTTIME = '밤에',
  IN_ALOLA = '알로라 지방에서',
  'ATTACK>DEFENSE' = '공격 > 방어일 때',
  'ATTACK<DEFENSE' = '공격 < 방어일 때',
  'ATTACK=DEFENSE' = '공격 = 방어일 때',
  IN_GALAR = '가라르 지방에서',
  RANDOM_BASED_ON_PERSONALITY = '랜덤',
  EMPTY_SPOT_IN_PARTY = '파티에 빈 공간이 있을 때',
  MALE = '수컷일 때',
  FEMALE = '암컷일 때',
  DARK_TYPE_POKEMON_IN_PARTY = '악 타입 포켓몬을 지니고 있을 때',
  HOLDING_CONSOLE_UPSIDEDOWN = '닌텐도 스위치 본체/컨트롤러의 위아래를 뒤집었을 때',
  DAYTIME = '낮에',
  DURING_RAIN = '비오는 날씨일 때',
  IN_POKEMON_SUN_OR_ULTRASUN = '썬, 울트라썬, 소드 버전에서',
  IN_POKEMON_MOON_OR_ULTRAMOON = '문, 울트라문, 실드 버전에서',
  DUSK_5_6PM = '울트라썬: 17:00~17:59, 울트라문: 05:00~05:59, 8세대: 19:00~19:59 일 때',
  WITH_A_LOW_KEY_NATURE = '노력, 고집, 개구쟁이, 용감, 온순, 장난꾸러기, 촐랑, 덜렁, 변덕, 건방, 성급, 명랑, 천진난만 성격일 때',
  WITH_AN_AMPEDNATURE = '외로움, 대담, 무사태평, 조심, 의젓, 수줍음, 냉정, 차분, 얌전, 신중, 겁쟁이, 성실 성격일 때',
}
export type LevelAdditionalConditionName = typeof LevelAdditionalConditionNames[keyof typeof LevelAdditionalConditionNames];

export enum FriendshipAdditionalConditionNames {
  DAYTIME = '낮에',
  NIGHTTIME = '밤에',
}
export type FriendshipAdditionalConditionName = typeof FriendshipAdditionalConditionNames[keyof typeof FriendshipAdditionalConditionNames];

export enum UseItemConditionNames {
  THUNDER_STONE = '천둥의돌',
  ICE_STONE = '얼음의돌',
  MOON_STONE = '달의돌',
  FIRE_STONE = '불꽃의돌',
  LEAF_STONE = '리프의돌',
  SUN_STONE = '태양의돌',
  WATER_STONE = '물의돌',
  GALARICA_CUFF = '가라두구팔찌',
  GALARICA_WREATH = '가라두구머리장식',
  SHINY_STONE = '빛의돌',
  DUSK_STONE = '어둠의돌',
  DAWN_STONE = '각성의돌',
  TART_APPLE = '새콤한 사과',
  SWEET_APPLE = '달콤한 사과',
  CRACKED_POT = '깨진 포트 or 이빠진 포트',
}
export type UseItemConditionName = typeof UseItemConditionNames[keyof typeof UseItemConditionNames];

export enum AdditionalConditionNames {
  IN_ALOLA = '알로라 지방에서',
  IN_GALAR = '가라르 지방에서',
  IN_GRASS = '풀숲에서',
  IN_CAVES = '동굴•사막•해안가에서',
  IN_BUILDINGS = '건물에서',
  POKEBALL_IN_BAG = '몬스터볼을 가지고 있는 상태에서',
  IN_POKEMON_SUN_OR_ULTRASUN = '썬, 울트라썬, 소드 버전에서',
  IN_POKEMON_MOON_OR_ULTRAMOON = '문, 울트라문, 실드 버전에서',
  MALE = '수컷일 때',
  FEMALE = '암컷일 때',
  OR_LEVEL_UP_IN_A_MAGNETIC_FIELD_AREA = '천관산(DPPt), 전기돌동굴(BW/BW2), 13번 도로-발전소가 있는 곳(XY), 뉴보라(ORAS), 포니대협곡(SM/USUM), 화끈산(USUM)에서 레벨업 또는',
  IN_A_MAGNETIC_FIELD_AREA = '천관산(DPPt), 전기돌동굴(BW/BW2), 13번 도로-발전소가 있는 곳(XY), 뉴보라(ORAS), 포니대협곡(SM/USUM), 화끈산(USUM)에서',
  OR_LEVEL_UP_WITH_MAX_BEAUTY = '아름다움 컨디션이 170 이상일 때 레벨업 또는',
  NIGHTTIME = '밤에',
  DAYTIME = '낮에',
}
export type AdditionalConditionName = typeof AdditionalConditionNames[keyof typeof AdditionalConditionNames];

export type Conditions = [string, string | undefined, string | undefined];
