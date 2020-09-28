export const DIFFERENT_FORM = {
  MEGA: '메가진화',
  MEGA_X: '메가진화 X',
  MEGA_Y: '메가진화 Y',
  GALARIAN_STANDARD_MODE: '리전 폼',
  GALARIAN_ZEN_MODE: '리전 폼 달마모드',
  ALOLA: '알로라 폼',
  GALAR: '가라르 폼',
  SUNNY_FORM: '태양의 모습',
  RAINY_FORM: '빗방울의 모습',
  SNOWY_FORM: '설운의 모습',
  PRIMAL: '원시회귀',
  NORMAL_FORM: '노말 폼',
  ATTACK_FORM: '어택 폼',
  DEFENSE_FORM: '디펜스 폼',
  SPEED_FORM: '스피드 폼',
  PLANT_CLOAK: '초목도롱',
  SANDY_CLOAK: '모래땅도롱',
  TRASH_CLOAK: '슈레도롱',
  HEAT_ROTOM: '히트로토무',
  WASH_ROTOM: '워시로토무',
  FROST_ROTOM: '프로스트로토무',
  FAN_ROTOM: '스핀로토무',
  MOW_ROTOM: '커트로토무',
  ALTERED_FORM: '어나더 폼',
  ORIGIN_FORM: '오리진 폼',
  LAND_FORM: '랜드 폼',
  SKY_FORM: '스카이 폼',
  STANDARD_MODE: '노말 폼',
  ZEN_MODE: '달마모드',
  INCARNATE_FORM: '화신 폼',
  THERIAN_FORM: '영물 폼',
  BLACK_KYUREM: '블랙큐레무',
  WHITE_KYUREM: '화이트큐레무',
  ORDINARY_FORM: '평소의모습',
  RESOLUTE_FORM: '각오의모습',
  ARIA_FORM: '보이스 폼',
  PIROUETTE_FORM: '스텝 폼',
  ASH_GRENINJA: '지우개굴닌자',
  SHIELD_FORM: '실드 폼',
  BLADE_FORM: '블레이드 폼',
  AVERAGE_SIZE: '일반 크기',
  SMALL_SIZE: '작은 크기',
  LARGE_SIZE: '큰 크기',
  SUPER_SIZE: '아주 큰 크기',
  FIFTY_PERCENT_FORM: '50% 폼',
  TEN_PERCENT_FORM: '10% 폼',
  COMPLETE_FORM: '퍼펙트 폼',
  HOOPA_CONFINED: '굴레에 빠진 후파',
  HOOPA_UNBOUND: '굴레를 벗어난 후파',
  BAILE_STYLE: '이글이글 스타일',
  POM_POM_STYLE: '파칙파칙 스타일',
  PA_U_STYLE: '훌라훌라 스타일',
  SENSU_STYLE: '하늘하늘 스타일',
  MIDDAY_FORM: '한낮의 모습',
  MIDNIGHT_FORM: '한밤중의 모습',
  DUSK_FORM: '황혼의 모습',
  SOLO_FORM: '단독의 모습',
  SCHOOL_FORM: '군집의 모습',
  METEOR_FORM: '유성의 모습',
  CORE_FORM: '코어의 모습',
  DUSK_MANE_NECROZMA: '황혼의 갈기',
  DAWN_WINGS_NECROZMA: '새벽의 날개',
  ULTRA_NECROZMA: '울트라네크로즈마',
  LOW_KEY_FORM: '로우한 모습',
  AMPED_FORM: '하이한 모습',
  ICE_FACE: '아이스 페이스',
  NOICE_FACE: '노아이스 페이스',
  FULL_BELLY_MODE: '배부른 모습',
  HUNGRY_MODE: '배고픈 모습',
  HERO_OF_MANY_BATTLES: '역전의 용사',
  CROWNED_SWORD: '검왕',
  CROWNED_SHIELD: '방패왕',
  ETERNAMAX: '무한다이맥스',
  SINGLE_STRIKE_STYLE: '일격의 태세',
  RAPID_STRIKE_STYLE: '연격의 태세',
} as const;
export type DIFFERENT_FORM = typeof DIFFERENT_FORM[keyof typeof DIFFERENT_FORM];

export const EVOLUTION_TYPE = {
  LEVEL: 'level',
  STONE: 'stone',
  TRADE: 'trade',
  FRIENDSHIP: 'friendship',
  STATUS: 'status',
  NONE: 'none',
} as const;
export type EVOLUTION_TYPE = typeof EVOLUTION_TYPE[keyof typeof EVOLUTION_TYPE];

export const ELEMENTAL_STONE = {
  FIRE: '불꽃의돌 사용',
  WATER: '물의돌 사용',
  THUNDER: '천둥의돌 사용',
  LEAF: '리프의돌 사용',
  MOON: '달의돌 사용',
  SUN: '태양의돌 사용',
  SHINY: '빛의돌 사용',
  DUSK: '어둠의돌 사용',
  DAWN: '각성의돌 사용',
  ICE: '얼음의돌 사용',
  TART_APPLE: '새콤한 사과 사용',
  SWEET_APPLE: '달콤한 사과 사용',
  CRACKED_POT: '깨진 포트 or 이빠진 포트 사용',
} as const;
export type ELEMENTAL_STONE = typeof ELEMENTAL_STONE[keyof typeof ELEMENTAL_STONE];

export const LEVEL_CONDITION = {
  NIGHT: '밤에 레벨업',
  DAY: '낮에 레벨업',
  MALE: '수컷일 때 레벨업',
  FEMALE: '암컷일 때 레벨업',
  IN_ALOLA: '알로라지방에서 레벨업',
  IN_GALAR: '가라르지방에서 레벨업',
  HIGH_ATTACK: '공격 > 방어일 때 레벨업',
  LOW_ATTACK: '공격 < 방어일 때 레벨업',
  SAME_ATTACK: '공격 = 방어일 때 레벨업',
  RANDOM: '랜덤',
  EMPTY_PARTY: '파티에 빈 공간이 있을 때 레벨업',
} as const;
export type LEVEL_CONDITION = typeof LEVEL_CONDITION[keyof typeof LEVEL_CONDITION];

export const TRADING_CONDITION = {
  NONE: '통신교환',
  KINGS_ROCK: '왕의징표석을 지니게 한 뒤 통신교환',
  METAL_COAT: '금속코트를 지니게 한 뒤 통신교환',
  PROTECTOR: '프로텍터를 지니게 한 뒤 통신교환',
  DRAGON_SCALE: '용의비늘을 지니게 한 뒤 통신교환',
  ELECTIRIZER: '에레키부스터를 지니게 한 뒤 통신교환',
  MAGMARIZER: '마그마부스터를 지니게 한 뒤 통신교환',
  UPGRADE: '업그레이드를 지니게 한 뒤 통신교환',
  DUBIOUS_DISC: '괴상한패치를 지니게 한 뒤 통신교환',
  PRISM_SCALE: '고운비늘을 지니게 한 뒤 통신교환 또는 아름다움 컨디션이 170 이상일 때 레벨업',
  REAPER_CLOTH: '영계의천을 지니게 한 뒤 통신교환',
  DEEP_SEA_TOOTH: '심해의이빨을 지니게 한 뒤 통신교환',
  DEEP_SEA_SCALE: '심해의비늘을 지니게 한 뒤 통신교환',
  WITH_SHELMET: '쪼마리와 통신교환',
  WITH_KARRABLAST: '딱정곤과 통신교환',
  SACHET: '향기주머니를 지니게 한 뒤 통신교환',
  WHIPPED_DREAM: '휘핑팝을 지니게 한 뒤 통신교환',
} as const;
export type TRADING_CONDITION = typeof TRADING_CONDITION[keyof typeof TRADING_CONDITION];

export const FRIENDSHIP = {
  ...LEVEL_CONDITION,
  NONE: '친밀도가 220 이상일때',
} as const;
export type FRIENDSHIP = typeof FRIENDSHIP[keyof typeof FRIENDSHIP];

const ABILITY_CONDITION = {
  ROLLOUT: '구르기를 배운뒤 레벨업',
  ANCIENT_POWER: '원시의힘을 배운 뒤 레벨업',
  MIMIC: '흉내내기를 배운 뒤 레벨업',
  DOUBLE_HIT: '더블어택을 배운 뒤 레벨업',
  STOMP: '짓밝기를 배운 뒤 레벨업',
  DRAGON_PULSE: '용의파동을 배운 뒤 레벨업',
  TAUNT: '도발을 배운 뒤 레벨업',
} as const;
type ABILITY_CONDITION = typeof ABILITY_CONDITION[keyof typeof ABILITY_CONDITION];
const ITEM_CONDITION = {
  OVAL_STONE: '둥글둥글 돌을 지니게 한 뒤 낮에 레벨업',
  RAZOR_FANG: '예리한이빨을 지니게 한 뒤 밤에 레벨업',
  RAZOR_CLAW: '예리한손톱을 지니게 한 뒤 밤에 레벨업',
  SWEET: '사탕공예를 지니게 하고 L스틱으로 캐릭터를 회전시킨다',
} as const;
type ITEM_CONDITION = typeof ITEM_CONDITION[keyof typeof ITEM_CONDITION];
const AREA_CONDITION = {
  IN_SUN_OR_ULTRA_SUN: '포켓몬스터 썬·울트라썬에서',
  IN_MOON_OR_ULTRA_MOON: '포켓몬스터 문·울트라문에서',
  IN_ULTRA_SUN_OR_ULTRA_MOON: '포켓몬스터 울트라썬·울트라문에서',
  MOSSY_ROCK: '4세대-7세대: 이끼 바위 근처에서 레벨 업, 8세대: 리프의돌 사용',
  ICY_ROCK: '4세대-7세대: 얼음 바위 근처에서 레벨 업, 8세대: 얼음의돌 사용',
} as const;
type AREA_CONDITION = typeof AREA_CONDITION[keyof typeof AREA_CONDITION];
export const OTHER_CONDITION = {
  ...LEVEL_CONDITION,
  ...ABILITY_CONDITION,
  ...ITEM_CONDITION,
  ...AREA_CONDITION,
  LEVEL_UP_IN_A_MAGNETIC_FIELD:
    '천관산(DPPt), 전기돌동굴(BW/BW2), 13번 도로-발전소가 있는 곳(XY), 뉴보라(ORAS), 포니대협곡(SM/USUM), 화끈산(USUM)에서 레벨업',
  RAIN: '비오는 날씨일때 레벨업',
  RANDOM: '랜덤',
  DUSK: '특성이 마이페이스이고 황혼 5시~6시일 때 레벨업',
  PRISM_SCALE: '고운비늘을 지니게 한 뒤 통신교환 또는 아름다움 컨디션이 170 이상일 때 레벨업',
  LOW_KEY: '성격이 노력, 고집, 개구쟁이, 용감, 온순, 장난꾸러기, 촐랑, 덜렁, 변덕, 건방, 성급, 명랑, 천진난만일 때',
  AMPED: '성격이 외로움, 대담, 무사태평, 조심, 의젓, 수줍음, 냉정, 차분, 얌전, 신중, 겁쟁이일 때',
  AFFECTION:
    '6세대-7세대: 포켓파를레를 통해 절친도를 2 이상 올리고 페어리 타입 기술을 배운 뒤 레벨 업, 8세대: 친밀도가 220 이상일 때 페어리 타입 기술을 배운 뒤 레벨 업',
  WITH_REMORAID_IN_PARTY: '총어를 데리고 있는 상태에서 레벨업',
  NEAR_DUSTY_BOWL: '49 이상의 누적 대미지를 입은 후 와일드에리어 모래먼지구덩이에 존재하는 고인돌 아래를 지나감',
  POKEMON_GO: '포켓몬 GO에서 사탕 400개를 이용해 진화',
  CRITICAL_HITS: '한 배틀에서 상대의 급소를 3번 맞춘다',
  IN_TOWER_OF_DARKNESS: '악의탑 제패',
  IN_TOWER_OF_WATER: '물의탑 제패',
} as const;
export type OTHER_CONDITION = typeof OTHER_CONDITION[keyof typeof OTHER_CONDITION];

export const ADDITIONAL_CONDITION = {
  NIGHT: '밤일 때',
  DAY: '낮일 때',
  MALE: '수컷일 때',
  FEMALE: '암컷일 때',
  IN_ALOLA: '알로라지방에서',
  IN_GALAR: '가라르지방에서',
  IN_GRASS: '풀숲에서',
  IN_CAVES: '동굴•사막•해안가에서',
  IN_BUILDINGS: '건물에서',
  OR_LEVEL_UP_IN_A_MAGNETIC_FIELD: '포니대협곡(SM/USUM), 화끈산(USUM)에서 레벨 업',
  ...AREA_CONDITION,
} as const;
export type ADDITIONAL_CONDITION = typeof ADDITIONAL_CONDITION[keyof typeof ADDITIONAL_CONDITION];

export const EXCEPTIONAL_FORM_KEY = {
  MEGA_X: 'MEGA_X',
  MEGA_Y: 'MEGA_Y',
  GALARIAN_STANDARD_MODE: 'GALARIAN_STANDARD_MODE',
  GALARIAN_ZEN_MODE: 'GALARIAN_ZEN_MODE',
  ASH_GRENINJA: 'ASH_GRENINJA',
  FIFTY_PERCENT: 'FIFTY_PERCENT',
  TEN_PERCENT: 'TEN_PERCENT',
  PA_U_STYLE: 'PA_U_STYLE',
  POM_POM_STYLE: 'POM_POM_STYLE',
  HUNGRY_MODE: 'HUNGRY_MODE',
} as const;
export type EXCEPTIONAL_FORM_KEY = typeof EXCEPTIONAL_FORM_KEY[keyof typeof EXCEPTIONAL_FORM_KEY];

export type Condition =
  | typeof LEVEL_CONDITION
  | typeof ELEMENTAL_STONE
  | typeof TRADING_CONDITION
  | typeof ADDITIONAL_CONDITION;
