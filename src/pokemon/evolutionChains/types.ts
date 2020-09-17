export interface IPokemon {
  name: string;
  image: string;
  differentForm: string | null;
}

export interface IEvolvingTo extends IPokemon {
  type: string;
  condition: string[];
}

export interface IEvolutionChain extends IPokemon {
  evolvingTo: IEvolvingTo[];
  name: string;
  image: string;
  differentForm: string | null;
}

export type CrawlingEvolution = (elements: Element[], type: string) => IEvolutionChain[];

export const EvolutionType = {
  LEVEL: 'level',
  STONE: 'stone',
  TRADE: 'trade',
  FRIENDSHIP: 'friendship',
};

export const FormType = {
  ALOLA: '알로라 폼',
  GALAR: '가라르 폼',
  WORMADAM_GRASS: '초목도롱',
  WORMADAM_CAVES: '모래땅도롱',
  WORMADAM_BUILDINGS: '슈레도롱',
  DARMANITAN_STANDARD: '평상시',
  ALOLA_DARMANITAN_STANDARD: '알로라 폼 평상시',
  ROCKRUFF_MID_DAY: '한낮의 모습',
  ROCKRUFF_MID_NIGHT: '한밤중의 모습',
  ROCKRUFF_DUSK: '황혼의 모습',
  TOXTRICITY_LOW: '로우한 모습',
  TOXTRICITY_HIGH: '하이한 모습',
  URSHIFU_SINGLE: '일격의 태세',
  URSHIFU_RAPID: '연격의 태세',
};

export const StoneType = {
  FIRE: '불꽃의돌',
  WATER: '물의돌',
  THUNDER: '천둥의돌',
  LEAF: '리프의돌',
  MOON: '달의돌',
  SUN: '태양의돌',
  SHINY: '빛의돌',
  DUSK: '어둠의돌',
  DAWN: '각성의돌',
  ICE: '얼음의돌',
};

export const AreaType = {
  ALOLA: '알로라 지방',
  GALAR: '가라르 지방',
  GRASS: '풀숲',
  CAVES: '동굴·사막·해안가',
  BUILDINGS: '건물',
  SUN_OR_ULTRA_SUN: '포켓몬스터 썬·울트라썬',
  MOON_OR_ULTRA_MOON: '포켓몬스터 문·울트라문',
  ULTRA_SUN_OR_ULTRA_MOON: '포켓몬스터 울트라썬·울트라문',
  POKEBALL: '몬스터볼',
};

export const ConditionType = {
  NIGHT: '밤에 레벨업',
  DAY: '낮에 레벨업',
  MALE: '수컷일때',
  FEMALE: '암컷일때',
};

export const AbilityConditionType = {
  ROLLOUT: '구르기를 배운뒤 레벨업',
  ANCIENT_POWER: '원시의힘을 배운 뒤 레벨업',
  MIMIC: '흉내내기를 배운 뒤 레벨업',
  DOUBLE_HIT: '더블어택을 배운 뒤 레벨업',
  STOMP: '짓밝기를 배운 뒤 레벨업',
  DRAGON_PULSE: '용의파동을 배운 뒤 레벨업',
  TAUNT: '도발을 배운 뒤 레벨업',
};

export const ItemConditionType = {
  OVAL_STONE: '둥글둥글 돌을 지니게 한 뒤 낮에 레벨업',
  RAZOR_FANG: '예리한이빨을 지니게 한 뒤 밤에 레벨업',
  RAZOR_CLAW: '예리한손톱을 지니게 한 뒤 밤에 레벨업',
  SWEET: '사탕공예를 지니게 하고 L스틱으로 캐릭터를 회전시킨다',
};

export const AreaConditionType = {
  ALOLA: '알로라지방에서 레벨업',
  GALAR: '가라르지방에서 레벨업',
  SUN_OR_ULTRA_SUN: `${AreaType.SUN_OR_ULTRA_SUN}에서 레벨업`,
  MOON_OR_ULTRA_MOON: `${AreaType.MOON_OR_ULTRA_MOON}에서 레벨업`,
  MAGNETIC_FIELD:
    '신오지방(DPPt): 천관산, 하나지방(BW/BW2): 전기돌동굴, 칼로스지방(XY): 13번도로(발전소가 있는 곳), 호연지방(ORAS): 뉴보라, 알로라지방(SM): 포니대협곡/화끈산(USUM), 가라르지방(SWSH): 천둥의돌 사용',
  MOSSY_ROCK: '4세대-7세대: 이끼 바위 근처에서 레벨 업, 8세대: 리프의돌 사용',
  ICY_ROCK: '4세대-7세대: 얼음 바위 근처에서 레벨 업, 8세대: 얼음의돌 사용',
  MOUNT_LANAKILA: '라나키라마운틴에서 레벨업',
  NEAR_DUSTY_BOWL: '49 이상의 누적 대미지를 입은 후 와일드에리어 모래먼지구덩이에 존재하는 고인돌 아래를 지나감',
};

export const TradingConditionType = {
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
};

export const OtherConditionType = {
  RAIN: '비오는 날씨일때',
  DUSK: '특성이 마이페이스이고 황혼 5시~6시일 때 레벨업',
  RANDOM: '랜덤',
  EMPTY_PARTY: '파티에 빈 공간이 있을 때',
  DARK_PARTY: '지닌포켓몬에 악타입이 있을 때',
  UPSIDE_DOWN: '3DS 뒤집기',
  HIGH_ATTACK: '공격 > 방어',
  LOW_ATTACK: '공격 < 방어',
  SAME_ATTACK: '공격 = 방어',
  TOXTRICITY_LOW: '노력, 고집, 개구쟁이, 용감, 온순, 장난꾸러기, 촐랑, 덜렁, 변덕, 건방, 성급, 명랑, 천진난만',
  TOXTRICITY_HIGH: '외로움, 대담, 무사태평, 조심, 의젓, 수줍음, 냉정, 차분, 얌전, 신중, 겁쟁이',
  AFFECTION:
    '6세대-7세대: 포켓파를레를 통해 절친도를 2 이상 올리고 페어리 타입 기술을 배운 뒤 레벨 업, 8세대: 친밀도가 220 이상일 때 페어리 타입 기술을 배운 뒤 레벨 업',
  WITH_REMORAID: '총어를 데리고 있는 상태에서 레벨업',
  MELMETAL: '포켓몬 GO에서 사탕 400개를 이용해 진화',
  CRITICAL_HITS: '한 배틀에서 상대의 급소를 3번 맞춘다',
  IN_TOWER_OF_DARKNESS: '악의탑 제패',
  IN_TOWER_OF_WATER: '물의탑 제패',
};
