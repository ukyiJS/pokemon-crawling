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

export enum TradeConditionNames {
  KINGS_ROCK = '왕의징표석을 지니게 한 뒤',
  METAL_COAT = '금속코트를 지니게 한 뒤',
  PROTECTOR = '프로텍터를 지니게 한 뒤',
  DRAGON_SCALE = '용의비늘을 지니게 한 뒤',
  ELECTIRIZER = '에레키부스터를 지니게 한 뒤',
  MAGMARIZER = '마그마부스터를 지니게 한 뒤',
  UPGRADE = '업그레이드를 지니게 한 뒤',
  DUBIOUS_DISC = '괴상한패치를 지니게 한 뒤',
  PRISM_SCALE = '3세대:아름다움 수치 230 이상 레벨업, 4세대: 아름다움 수치 MAX 상태에서 레벨 업, 5세대 이후: 고운비늘을 지니게 한 뒤',
  REAPER_CLOTH = '영계의천을 지니게 한 뒤',
  DEEP_SEA_TOOTH = '심해의이빨을 지니게 한 뒤',
  DEEP_SEA_SCALE = '심해의비늘을 지니게 한 뒤',
  TRADE_WITH_SHELMET = '쪼마리와',
  TRADE_WITH_KARRABLAST = '딱정곤과',
  SACHET = '향기주머니를 지니게 한 뒤',
  WHIPPED_DREAM = '휘핑팝을 지니게 한 뒤',
}
export type TradeConditionName = typeof TradeConditionNames[keyof typeof TradeConditionNames];

export enum OtherConditionNames {
  LEVEL_UP_IN_A_MAGNETIC_FIELD_AREA = '천관산(DPPt), 전기돌동굴(BW/BW2), 13번 도로-발전소가 있는 곳(XY), 뉴보라(ORAS), 포니대협곡(SM/USUM), 화끈산(USUM)에서 레벨업',
  AFTER_ROLLOUT_LEARNED = '구르기를 배운뒤 레벨업',
  AFTER_ANCIENT_POWER_LEARNED = '원시의힘을 배운 뒤 레벨업',
  AFTER_MIMIC_LEARNED = '흉내내기를 배운 뒤 레벨업',
  LEVEL_UP_NEAR_A_MOSSY_ROCK = '4-7세대: 이끼 바위에서 레벨업, 8세대: 리프의돌 사용',
  LEVEL_UP_NEAR_AN_ICY_ROCK = '4-7세대: 얼음 바위에서 레벨업, 8세대: 얼음의돌 사용',
  AFFECTION_IN_POKEMON_AMIE = '6-7세대: 포켓파를레/포켓리프레 절친도가 2단계 이상일 때 레벨업, 8세대: 친밀도 220+ 레벨업',
  KNOWING_FAIRY_MOVE = '페어리 타입 기술을 배우고',
  AFTER_DOUBLE_HIT_LEARNED = '더블어택을 배운 뒤 레벨업',
  HOLD_OVAL_STONE = '둥글둥글돌을 지니고 레벨업',
  HOLD_RAZOR_FANG = '예리한 이빨을 지니고 레벨업',
  HOLD_RAZOR_CLAW = '예리한 손톱을 지니고 레벨업',
  WITH_REMORAID_IN_PARTY = '파티에 총어가 있을 때 레벨 업',
  TRADE_HOLDING_PRISM_SCALE = '3세대: 아름다움 수치 230 이상 레벨업, 4세대: 아름다움 수치 MAX 상태에서 레벨 업, 5세대 이후: 고운비늘을 지니고 통신교환',
  NEAR_DUSTY_BOWL = '49이상의 대미지 누적을 받은 후 와일드에리어 모래먼지구덩이에 있는 고인돌 형태의 바위 아래로 통과(상대 포켓몬에게 직접 받은 대미지만 가능하며 기절하면 초기화)',
  AT_MOUNT_LANAKILA = '라나키라마운틴에서 레벨업',
  AFTER_STOMP_LEARNED = '짓밝기를 배운 뒤 레벨업',
  AFTER_DRAGON_PULSE_LEARNED = '용의파동을 배운 뒤 레벨업',
  POKEMON_GO_ONLY = '포켓몬 GO에서 사탕 400개를 이용해 진화',
  SPIN_AROUND_HOLDING_SWEET = '사탕공예를 지니게 하고 L스틱으로 캐릭터를 회전시킨다',
  ACHIEVE_3_CRITICAL_HITS_IN_ONE_BATTLE = '한 배틀에서 상대의 급소를 3번 맞춘다.',
  AFTER_TAUNT_LEARNED = '도발을 배운 뒤 레벨업',
  IN_TOWER_OF_DARKNESS = '악의탑 제페',
  IN_TOWER_OF_WATER = '물의탑 제패',
}
export type OtherConditionName = typeof OtherConditionNames[keyof typeof OtherConditionNames];

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
