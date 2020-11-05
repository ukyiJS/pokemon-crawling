export const levelCondition = {
  NIGHTTIME: '밤에',
  IN_ALOLA: '알로라 지방에서',
  'ATTACK>DEFENSE': '공격 > 방어일 때',
  'ATTACK<DEFENSE': '공격 < 방어일 때',
  'ATTACK=DEFENSE': '공격 = 방어일 때',
  IN_GALAR: '가라르 지방에서',
  RANDOM_BASED_ON_PERSONALITY: '랜덤',
  EMPTY_SPOT_IN_PARTY: '파티에 빈 공간이 있을 때',
  MALE: '수컷일 때',
  FEMALE: '암컷일 때',
  DARK_TYPE_POKEMON_IN_PARTY: '악 타입 포켓몬을 지니고 있을 때',
  HOLDING_CONSOLE_UPSIDEDOWN: '닌텐도 스위치 본체/컨트롤러의 위아래를 뒤집었을 때',
  DAYTIME: '낮에',
  DURING_RAIN: '비오는 날씨일 때',
  IN_POKEMON_SUN_OR_ULTRASUN: '썬, 울트라썬, 소드 버전에서',
  IN_POKEMON_MOON_OR_ULTRAMOON: '문, 울트라문, 실드 버전에서',
  'DUSK_5-6PM': '울트라썬: 17:00~17:59, 울트라문: 05:00~05:59, 8세대: 19:00~19:59 일 때',
  WITH_A_LOW_KEY_NATURE:
    '노력, 고집, 개구쟁이, 용감, 온순, 장난꾸러기, 촐랑, 덜렁, 변덕, 건방, 성급, 명랑, 천진난만 성격일 때',
  WITH_AN_AMPEDNATURE: '외로움, 대담, 무사태평, 조심, 의젓, 수줍음, 냉정, 차분, 얌전, 신중, 겁쟁이, 성실 성격일 때',
} as const;
export type LevelCondition = typeof levelCondition[keyof typeof levelCondition];
