export const DIFFERENT_FORM = {
  MEGA_X: '메가진화 X',
  MEGA_Y: '메가진화 Y',
  MEGA: '메가진화',
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
  MALE: '수컷',
  FEMALE: '암컷',
  OWN_TEMPO_ROCKRUFF: '마이페이스 암멍이',
  RED_STRIPED_FORM: '적색근의 모습',
  BLUE_STRIPED_FORM: '청색근의 모습',
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
  FIFTY_PERCENT_FORM: 'FIFTY_PERCENT_FORM',
  TEN_PERCENT_FORM: 'TEN_PERCENT_FORM',
  PA_U_STYLE: 'PA_U_STYLE',
  POM_POM_STYLE: 'POM_POM_STYLE',
  HUNGRY_MODE: 'HUNGRY_MODE',
} as const;
export type EXCEPTIONAL_FORM_KEY = typeof EXCEPTIONAL_FORM_KEY[keyof typeof EXCEPTIONAL_FORM_KEY];

export const POKEMON_TYPE = {
  NORMAL: '노말',
  FIRE: '불',
  WATER: '물',
  ELECTRIC: '전기',
  GRASS: '풀',
  ICE: '얼음',
  FIGHTING: '비행',
  POISON: '독',
  GROUND: '땅',
  FLYING: '비행',
  PSYCHIC: '에스퍼',
  BUG: '벌레',
  ROCK: '바위',
  GHOST: '고스트',
  DRAGON: '드래곤',
  DARK: '악',
  STEEL: '강철',
  FAIRY: '페어리',
} as const;
export type POKEMON_TYPE = typeof POKEMON_TYPE[keyof typeof POKEMON_TYPE];

export type Condition =
  | typeof LEVEL_CONDITION
  | typeof ELEMENTAL_STONE
  | typeof TRADING_CONDITION
  | typeof ADDITIONAL_CONDITION;

export const STAT = {
  HP: 'HP',
  ATTACK: '공격',
  DEFENSE: '방어',
  SP_ATTACK: '특수공격',
  SP_DEFENSE: '특수방어',
  SPEED: '스피드',
  TOTAL: '총합',
} as const;
export type STAT = typeof STAT[keyof typeof STAT];

export const ABILITY = {
  STENCH: '악취',
  DRIZZLE: '잔비',
  SPEED_BOOST: '가속',
  BATTLE_ARMOR: '전투무장',
  STURDY: '옹골참',
  DAMP: '습기',
  LIMBER: '유연',
  SAND_VEIL: '모래숨기',
  STATIC: '정전기',
  VOLT_ABSORB: '축전',
  WATER_ABSORB: '저수',
  OBLIVIOUS: '둔감',
  CLOUD_NINE: '날씨부정',
  COMPOUND_EYES: '복안',
  INSOMNIA: '불면',
  COLOR_CHANGE: '변색',
  IMMUNITY: '면역',
  FLASH_FIRE: '타오르는불꽃',
  SHIELD_DUST: '인분',
  OWN_TEMPO: '마이페이스',
  SUCTION_CUPS: '흡반',
  INTIMIDATE: '위협',
  SHADOW_TAG: '그림자밟기',
  ROUGH_SKIN: '까칠한피부',
  WONDER_GUARD: '불가사의부적',
  LEVITATE: '부유',
  EFFECT_SPORE: '포자',
  SYNCHRONIZE: '싱크로',
  CLEAR_BODY: '클리어바디',
  NATURAL_CURE: '자연회복',
  LIGHTNING_ROD: '피뢰침',
  SERENE_GRACE: '하늘의은총',
  SWIFT_SWIM: '쓱쓱',
  CHLOROPHYLL: '엽록소',
  ILLUMINATE: '발광',
  TRACE: '트레이스',
  HUGE_POWER: '천하장사',
  POISON_POINT: '독가시',
  INNER_FOCUS: '정신력',
  MAGMA_ARMOR: '마그마의무장',
  WATER_VEIL: '수의베일',
  MAGNET_PULL: '자력',
  SOUNDPROOF: '방음',
  RAIN_DISH: '젖은접시',
  SAND_STREAM: '모래날림',
  PRESSURE: '프레셔',
  THICK_FAT: '두꺼운지방',
  EARLY_BIRD: '일찍기상',
  FLAME_BODY: '불꽃몸',
  RUN_AWAY: '도주',
  KEEN_EYE: '날카로운눈',
  HYPER_CUTTER: '괴력집게',
  PICKUP: '픽업',
  TRUANT: '게으름',
  HUSTLE: '의욕',
  CUTE_CHARM: '헤롱헤롱바디',
  PLUS: '플러스',
  MINUS: '마이너스',
  FORECAST: '기분파',
  STICKY_HOLD: '점착',
  SHED_SKIN: '탈피',
  GUTS: '근성',
  MARVEL_SCALE: '이상한비늘',
  LIQUID_OOZE: '해감액',
  OVERGROW: '심록',
  BLAZE: '맹화',
  TORRENT: '급류',
  SWARM: '벌레의알림',
  ROCK_HEAD: '돌머리',
  DROUGHT: '가뭄',
  ARENA_TRAP: '개미지옥',
  VITAL_SPIRIT: '의기양양',
  WHITE_SMOKE: '하얀연기',
  PURE_POWER: '순수한힘',
  SHELL_ARMOR: '조가비갑옷',
  AIR_LOCK: '에어록',
  TANGLED_FEET: '갈지자걸음',
  MOTOR_DRIVE: '전기엔진',
  RIVALRY: '투쟁심',
  STEADFAST: '불굴의마음',
  SNOW_CLOAK: '눈숨기',
  GLUTTONY: '먹보',
  ANGER_POINT: '분노의경혈',
  UNBURDEN: '곡예',
  HEATPROOF: '내열',
  SIMPLE: '단순',
  DRY_SKIN: '건조피부',
  DOWNLOAD: '다운로드',
  IRON_FIST: '철주먹',
  POISON_HEAL: '포이즌힐',
  ADAPTABILITY: '적응력',
  SKILL_LINK: '스킬링크',
  HYDRATION: '촉촉바디',
  SOLAR_POWER: '선파워',
  QUICK_FEET: '속보',
  NORMALIZE: '노말스킨',
  SNIPER: '스나이퍼',
  MAGIC_GUARD: '매직가드',
  NO_GUARD: '노가드',
  STALL: '시간벌기',
  TECHNICIAN: '테크니션',
  LEAF_GUARD: '리프가드',
  KLUTZ: '서투름',
  MOLD_BREAKER: '틀깨기',
  SUPER_LUCK: '대운',
  AFTERMATH: '유폭',
  ANTICIPATION: '위험예지',
  FOREWARN: '예지몽',
  UNAWARE: '천진',
  TINTED_LENS: '색안경',
  FILTER: '필터',
  SLOW_START: '슬로스타트',
  SCRAPPY: '배짱',
  STORM_DRAIN: '마중물',
  ICE_BODY: '아이스바디',
  SOLID_ROCK: '하드록',
  SNOW_WARNING: '눈퍼뜨리기',
  HONEY_GATHER: '꿀모으기',
  FRISK: '통찰',
  RECKLESS: '이판사판',
  MULTITYPE: '멀티타입',
  FLOWER_GIFT: '플라워기프트',
  BAD_DREAMS: '나이트메어',
  PICKPOCKET: '나쁜손버릇',
  SHEER_FORCE: '우격다짐',
  CONTRARY: '심술꾸러기',
  UNNERVE: '긴장감',
  DEFIANT: '오기',
  DEFEATIST: '무기력',
  CURSED_BODY: '저주받은바디',
  HEALER: '치유의마음',
  FRIEND_GUARD: '프렌드가드',
  WEAK_ARMOR: '깨어진갑옷',
  HEAVY_METAL: '헤비메탈',
  LIGHT_METAL: '라이트메탈',
  MULTISCALE: '멀티스케일',
  TOXIC_BOOST: '독폭주',
  FLARE_BOOST: '열폭주',
  HARVEST: '수확',
  TELEPATHY: '텔레파시',
  MOODY: '변덕쟁이',
  OVERCOAT: '방진',
  POISON_TOUCH: '독수',
  REGENERATOR: '재생력',
  BIG_PECKS: '부풀린가슴',
  SAND_RUSH: '모래헤치기',
  WONDER_SKIN: '미라클스킨',
  ANALYTIC: '애널라이즈',
  ILLUSION: '일루전',
  IMPOSTER: '괴짜',
  INFILTRATOR: '틈새포착',
  MUMMY: '미라',
  MOXIE: '자기과신',
  JUSTIFIED: '정의의마음',
  RATTLED: '주눅',
  MAGIC_BOUNCE: '매직미러',
  SAP_SIPPER: '초식',
  PRANKSTER: '짓궂은마음',
  SAND_FORCE: '모래의힘',
  IRON_BARBS: '철가시',
  ZEN_MODE: '달마모드',
  VICTORY_STAR: '승리의별',
  TURBOBLAZE: '터보블레이즈',
  TERAVOLT: '테라볼티지',
  AROMA_VEIL: '아로마베일',
  FLOWER_VEIL: '플라워베일',
  CHEEK_POUCH: '볼주머니',
  PROTEAN: '변환자재',
  FUR_COAT: '퍼코트',
  MAGICIAN: '매지션',
  BULLETPROOF: '방탄',
  COMPETITIVE: '승기',
  STRONG_JAW: '옹골찬턱',
  REFRIGERATE: '프리즈스킨',
  SWEET_VEIL: '스위트베일',
  STANCE_CHANGE: '배틀스위치',
  GALE_WINGS: '질풍날개',
  MEGA_LAUNCHER: '메가런처',
  GRASS_PELT: '풀모피',
  SYMBIOSIS: '공생',
  TOUGH_CLAWS: '단단한발톱',
  PIXILATE: '페어리스킨',
  GOOEY: '미끈미끈',
  AERILATE: '스카이스킨',
  PARENTAL_BOND: '부자유친',
  DARK_AURA: '다크오라',
  FAIRY_AURA: '페어리오라',
  AURA_BREAK: '오라브레이크',
  PRIMORDIAL_SEA: '시작의바다',
  DESOLATE_LAND: '끝의대지',
  DELTA_STREAM: '델타스트림',
  RKS_SYSTEM: 'AR시스템',
  LIQUID_VOICE: '촉촉보이스',
  GALVANIZE: '일렉트릭스킨',
  LONG_REACH: '원격',
  DANCER: '무희',
  TANGLING_HAIR: '컬리헤어',
  POWER_OF_ALCHEMY: '과학의힘',
  EMERGENCY_EXIT: '위기회피',
  BERSERK: '발끈',
  SCHOOLING: '어군',
  SURGE_SURFER: '서핑테일',
  STAMINA: '지구력',
  QUEENLY_MAJESTY: '여왕의위엄',
  WATER_BUBBLE: '수포',
  POWER_CONSTRUCT: '스웜체인지',
  COMATOSE: '절대안깸',
  INNARDS_OUT: '내용물분출',
  WIMP_OUT: '도망태세',
  STEELWORKER: '강철술사',
  DISGUISE: '탈',
  BATTERY: '배터리',
  STAKEOUT: '잠복',
  TRIAGE: '힐링시프트',
  MERCILESS: '무도한행동',
  DAZZLING: '비비드바디',
  CORROSION: '부식',
  WATER_COMPACTION: '꾸덕꾸덕굳기',
  FLUFFY: '복슬복슬',
  SLUSH_RUSH: '눈치우기',
  SHIELDS_DOWN: '리밋실드',
  RECEIVER: '리시버',
  ELECTRIC_SURGE: '일렉트릭메이커',
  PSYCHIC_SURGE: '사이코메이커',
  GRASSY_SURGE: '그래스메이커',
  MISTY_SURGE: '미스트메이커',
  FULL_METAL_BODY: '메탈프로텍트',
  SHADOW_SHIELD: '스펙터가드',
  BEAST_BOOST: '비스트부스트',
  PRISM_ARMOR: '프리즘아머',
  SOUL_HEART: '소울하트',
  STEELY_SPIRIT: '강철정신',
  STALWART: '굳건한신념',
  GULP_MISSILE: '그대로꿀꺽미사일',
  HUNGER_SWITCH: '꼬르륵스위치',
  WANDERING_SPIRIT: '떠도는영혼',
  LIBERO: '리베로',
  PERISH_BODY: '멸망의바디',
  SAND_SPIT: '모래뿜기',
  GORILLA_TACTICS: '무아지경',
  MIRROR_ARMOR: '미러아머',
  SCREEN_CLEANER: '배리어프리',
  UNSEEN_FIST: '보이지않는주먹',
  BALL_FETCH: '볼줍기',
  DAUNTLESS_SHIELD: '불굴의방패',
  INTREPID_SWORD: '불요의검',
  COTTON_DOWN: '솜털',
  RIPEN: '숙성',
  PROPELLER_TAIL: '스크루지느러미',
  ICE_FACE: '아이스페이스',
  ICE_SCALES: '얼음인분',
  DRAGON_S_MAW: '용의턱',
  MIMICRY: '의태',
  STEAM_ENGINE: '증기기관',
  QUICK_DRAW: '퀵드로',
  TRANSISTOR: '트랜지스터',
  PASTEL_VEIL: '파스텔베일',
  POWER_SPOT: '파워스폿',
  PUNK_ROCK: '펑크록',
  NEUTRALIZING_GAS: '화학변화가스',
  CURIOUS_MEDICINE: '기묘한약',
} as const;
export type ABILITY = typeof ABILITY[keyof typeof ABILITY];

export const EGG_GROUP = {
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
export type EGG_GROUP = typeof EGG_GROUP[keyof typeof EGG_GROUP];

export const POKEMON = {
  BULBASAUR: '이상해씨',
  IVYSAUR: '이상해풀',
  VENUSAUR: '이상해꽃',
  CHARMANDER: '파이리',
  CHARMELEON: '리자드',
  CHARIZARD: '리자몽',
  SQUIRTLE: '꼬부기',
  WARTORTLE: '어니부기',
  BLASTOISE: '거북왕',
  CATERPIE: '캐터피',
  METAPOD: '단데기',
  BUTTERFREE: '버터플',
  WEEDLE: '뿔충이',
  KAKUNA: '딱충이',
  BEEDRILL: '독침붕',
  PIDGEY: '구구',
  PIDGEOTTO: '피죤',
  PIDGEOT: '피죤투',
  RATTATA: '꼬렛',
  RATICATE: '레트라',
  SPEAROW: '깨비참',
  FEAROW: '깨비드릴조',
  EKANS: '아보',
  ARBOK: '아보크',
  PIKACHU: '피카츄',
  RAICHU: '라이츄',
  SANDSHREW: '모래두지',
  SANDSLASH: '고지',
  NIDORAN_M: '니드런♂',
  NIDORINO: '니드리노',
  NIDOKING: '니드킹',
  NIDORAN_F: '니드런♀',
  NIDORINA: '니드리나',
  NIDOQUEEN: '니드퀸',
  CLEFAIRY: '삐삐',
  CLEFABLE: '픽시',
  VULPIX: '식스테일',
  NINETALES: '나인테일',
  JIGGLYPUFF: '푸린',
  WIGGLYTUFF: '푸크린',
  ZUBAT: '주뱃',
  GOLBAT: '골뱃',
  ODDISH: '뚜벅쵸',
  GLOOM: '냄새꼬',
  VILEPLUME: '라플레시아',
  PARAS: '파라스',
  PARASECT: '파라섹트',
  VENONAT: '콘팡',
  VENOMOTH: '도나리',
  DIGLETT: '디그다',
  DUGTRIO: '닥트리오',
  MEOWTH: '나옹',
  PERSIAN: '페르시온',
  PSYDUCK: '고라파덕',
  GOLDUCK: '골덕',
  MANKEY: '망키',
  PRIMEAPE: '성원숭',
  GROWLITHE: '가디',
  ARCANINE: '윈디',
  POLIWAG: '발챙이',
  POLIWHIRL: '슈륙챙이',
  POLIWRATH: '강챙이',
  ABRA: '캐이시',
  KADABRA: '윤겔라',
  ALAKAZAM: '후딘',
  MACHOP: '알통몬',
  MACHOKE: '근육몬',
  MACHAMP: '괴력몬',
  BELLSPROUT: '모다피',
  WEEPINBELL: '우츠동',
  VICTREEBEL: '우츠보트',
  TENTACOOL: '왕눈해',
  TENTACRUEL: '독파리',
  GEODUDE: '꼬마돌',
  GRAVELER: '데구리',
  GOLEM: '딱구리',
  PONYTA: '포니타',
  RAPIDASH: '날쌩마',
  SLOWPOKE: '야돈',
  SLOWBRO: '야도란',
  MAGNEMITE: '코일',
  MAGNETON: '레어코일',
  FARFETCH_D: '파오리',
  DODUO: '두두',
  DODRIO: '두트리오',
  SEEL: '쥬쥬',
  DEWGONG: '쥬레곤',
  GRIMER: '질퍽이',
  MUK: '질뻐기',
  SHELLDER: '셀러',
  CLOYSTER: '파르셀',
  GASTLY: '고오스',
  HAUNTER: '고우스트',
  GENGAR: '팬텀',
  ONIX: '롱스톤',
  DROWZEE: '슬리프',
  HYPNO: '슬리퍼',
  KRABBY: '크랩',
  KINGLER: '킹크랩',
  VOLTORB: '찌리리공',
  ELECTRODE: '붐볼',
  EXEGGCUTE: '아라리',
  EXEGGUTOR: '나시',
  CUBONE: '탕구리',
  MAROWAK: '텅구리',
  HITMONLEE: '시라소몬',
  HITMONCHAN: '홍수몬',
  LICKITUNG: '내루미',
  KOFFING: '또가스',
  WEEZING: '또도가스',
  RHYHORN: '뿔카노',
  RHYDON: '코뿌리',
  CHANSEY: '럭키',
  TANGELA: '덩쿠리',
  KANGASKHAN: '캥카',
  HORSEA: '쏘드라',
  SEADRA: '시드라',
  GOLDEEN: '콘치',
  SEAKING: '왕콘치',
  STARYU: '별가사리',
  STARMIE: '아쿠스타',
  MR__MIME: '마임맨',
  SCYTHER: '스라크',
  JYNX: '루주라',
  ELECTABUZZ: '에레브',
  MAGMAR: '마그마',
  PINSIR: '쁘사이저',
  TAUROS: '켄타로스',
  MAGIKARP: '잉어킹',
  GYARADOS: '갸라도스',
  LAPRAS: '라프라스',
  DITTO: '메타몽',
  EEVEE: '이브이',
  VAPOREON: '샤미드',
  JOLTEON: '쥬피썬더',
  FLAREON: '부스터',
  PORYGON: '폴리곤',
  OMANYTE: '암나이트',
  OMASTAR: '암스타',
  KABUTO: '투구',
  KABUTOPS: '투구푸스',
  AERODACTYL: '프테라',
  SNORLAX: '잠만보',
  ARTICUNO: '프리져',
  ZAPDOS: '썬더',
  MOLTRES: '파이어',
  DRATINI: '미뇽',
  DRAGONAIR: '신뇽',
  DRAGONITE: '망나뇽',
  MEWTWO: '뮤츠',
  MEW: '뮤',
  CHIKORITA: '치코리타',
  BAYLEEF: '베이리프',
  MEGANIUM: '메가니움',
  CYNDAQUIL: '브케인',
  QUILAVA: '마그케인',
  TYPHLOSION: '블레이범',
  TOTODILE: '리아코',
  CROCONAW: '엘리게이',
  FERALIGATR: '장크로다일',
  SENTRET: '꼬리선',
  FURRET: '다꼬리',
  HOOTHOOT: '부우부',
  NOCTOWL: '야부엉',
  LEDYBA: '레디바',
  LEDIAN: '레디안',
  SPINARAK: '페이검',
  ARIADOS: '아리아도스',
  CROBAT: '크로뱃',
  CHINCHOU: '초라기',
  LANTURN: '랜턴',
  PICHU: '피츄',
  CLEFFA: '삐',
  IGGLYBUFF: '푸푸린',
  TOGEPI: '토게피',
  TOGETIC: '토게틱',
  NATU: '네이티',
  XATU: '네이티오',
  MAREEP: '메리프',
  FLAAFFY: '보송송',
  AMPHAROS: '전룡',
  BELLOSSOM: '아르코',
  MARILL: '마릴',
  AZUMARILL: '마릴리',
  SUDOWOODO: '꼬지모',
  POLITOED: '왕구리',
  HOPPIP: '통통코',
  SKIPLOOM: '두코',
  JUMPLUFF: '솜솜코',
  AIPOM: '에이팜',
  SUNKERN: '해너츠',
  SUNFLORA: '해루미',
  YANMA: '왕자리',
  WOOPER: '우파',
  QUAGSIRE: '누오',
  ESPEON: '에브이',
  UMBREON: '블래키',
  MURKROW: '니로우',
  SLOWKING: '야도킹',
  MISDREAVUS: '무우마',
  UNOWN: '안농',
  WOBBUFFET: '마자용',
  GIRAFARIG: '키링키',
  PINECO: '피콘',
  FORRETRESS: '쏘콘',
  DUNSPARCE: '노고치',
  GLIGAR: '글라이거',
  STEELIX: '강철톤',
  SNUBBULL: '블루',
  GRANBULL: '그랑블루',
  QWILFISH: '침바루',
  SCIZOR: '핫삼',
  SHUCKLE: '단단지',
  HERACROSS: '헤라크로스',
  SNEASEL: '포푸니',
  TEDDIURSA: '깜지곰',
  URSARING: '링곰',
  SLUGMA: '마그마그',
  MAGCARGO: '마그카르고',
  SWINUB: '꾸꾸리',
  PILOSWINE: '메꾸리',
  CORSOLA: '코산호',
  REMORAID: '총어',
  OCTILLERY: '대포무노',
  DELIBIRD: '딜리버드',
  MANTINE: '만타인',
  SKARMORY: '무장조',
  HOUNDOUR: '델빌',
  HOUNDOOM: '헬가',
  KINGDRA: '킹드라',
  PHANPY: '코코리',
  DONPHAN: '코리갑',
  PORYGON_: '폴리곤2',
  STANTLER: '노라키',
  SMEARGLE: '루브도',
  TYROGUE: '배루키',
  HITMONTOP: '카포에라',
  SMOOCHUM: '뽀뽀라',
  ELEKID: '에레키드',
  MAGBY: '마그비',
  MILTANK: '밀탱크',
  BLISSEY: '해피너스',
  RAIKOU: '라이코',
  ENTEI: '앤테이',
  SUICUNE: '스이쿤',
  LARVITAR: '애버라스',
  PUPITAR: '데기라스',
  TYRANITAR: '마기라스',
  LUGIA: '루기아',
  HO_OH: '칠색조',
  CELEBI: '세레비',
  TREECKO: '나무지기',
  GROVYLE: '나무돌이',
  SCEPTILE: '나무킹',
  TORCHIC: '아차모',
  COMBUSKEN: '영치코',
  BLAZIKEN: '번치코',
  MUDKIP: '물짱이',
  MARSHTOMP: '늪짱이',
  SWAMPERT: '대짱이',
  POOCHYENA: '포챠나',
  MIGHTYENA: '그라에나',
  ZIGZAGOON: '지그제구리',
  LINOONE: '직구리',
  WURMPLE: '개무소',
  SILCOON: '실쿤',
  BEAUTIFLY: '뷰티플라이',
  CASCOON: '카스쿤',
  DUSTOX: '독케일',
  LOTAD: '연꽃몬',
  LOMBRE: '로토스',
  LUDICOLO: '로파파',
  SEEDOT: '도토링',
  NUZLEAF: '잎새코',
  SHIFTRY: '다탱구',
  TAILLOW: '테일로',
  SWELLOW: '스왈로',
  WINGULL: '갈모매',
  PELIPPER: '패리퍼',
  RALTS: '랄토스',
  KIRLIA: '킬리아',
  GARDEVOIR: '가디안',
  SURSKIT: '비구술',
  MASQUERAIN: '비나방',
  SHROOMISH: '버섯꼬',
  BRELOOM: '버섯모',
  SLAKOTH: '게을로',
  VIGOROTH: '발바로',
  SLAKING: '게을킹',
  NINCADA: '토중몬',
  NINJASK: '아이스크',
  SHEDINJA: '껍질몬',
  WHISMUR: '소곤룡',
  LOUDRED: '노공룡',
  EXPLOUD: '폭음룡',
  MAKUHITA: '마크탕',
  HARIYAMA: '하리뭉',
  AZURILL: '루리리',
  NOSEPASS: '코코파스',
  SKITTY: '에나비',
  DELCATTY: '델케티',
  SABLEYE: '깜까미',
  MAWILE: '입치트',
  ARON: '가보리',
  LAIRON: '갱도라',
  AGGRON: '보스로라',
  MEDITITE: '요가랑',
  MEDICHAM: '요가램',
  ELECTRIKE: '썬더라이',
  MANECTRIC: '썬더볼트',
  PLUSLE: '플러시',
  MINUN: '마이농',
  VOLBEAT: '볼비트',
  ILLUMISE: '네오비트',
  ROSELIA: '로젤리아',
  GULPIN: '꼴깍몬',
  SWALOT: '꿀꺽몬',
  CARVANHA: '샤프니아',
  SHARPEDO: '샤크니아',
  WAILMER: '고래왕자',
  WAILORD: '고래왕',
  NUMEL: '둔타',
  CAMERUPT: '폭타',
  TORKOAL: '코터스',
  SPOINK: '피그점프',
  GRUMPIG: '피그킹',
  SPINDA: '얼루기',
  TRAPINCH: '톱치',
  VIBRAVA: '비브라바',
  FLYGON: '플라이곤',
  CACNEA: '선인왕',
  CACTURNE: '밤선인',
  SWABLU: '파비코',
  ALTARIA: '파비코리',
  ZANGOOSE: '쟝고',
  SEVIPER: '세비퍼',
  LUNATONE: '루나톤',
  SOLROCK: '솔록',
  BARBOACH: '미꾸리',
  WHISCASH: '메깅',
  CORPHISH: '가재군',
  CRAWDAUNT: '가재장군',
  BALTOY: '오뚝군',
  CLAYDOL: '점토도리',
  LILEEP: '릴링',
  CRADILY: '릴리요',
  ANORITH: '아노딥스',
  ARMALDO: '아말도',
  FEEBAS: '빈티나',
  MILOTIC: '밀로틱',
  CASTFORM: '캐스퐁',
  KECLEON: '켈리몬',
  SHUPPET: '어둠대신',
  BANETTE: '다크펫',
  DUSKULL: '해골몽',
  DUSCLOPS: '미라몽',
  TROPIUS: '트로피우스',
  CHIMECHO: '치렁',
  ABSOL: '앱솔',
  WYNAUT: '마자',
  SNORUNT: '눈꼬마',
  GLALIE: '얼음귀신',
  SPHEAL: '대굴레오',
  SEALEO: '씨레오',
  WALREIN: '씨카이저',
  CLAMPERL: '진주몽',
  HUNTAIL: '헌테일',
  GOREBYSS: '분홍장이',
  RELICANTH: '시라칸',
  LUVDISC: '사랑동이',
  BAGON: '아공이',
  SHELGON: '쉘곤',
  SALAMENCE: '보만다',
  BELDUM: '메탕',
  METANG: '메탕구',
  METAGROSS: '메타그로스',
  REGIROCK: '레지락',
  REGICE: '레지아이스',
  REGISTEEL: '레지스틸',
  LATIAS: '라티아스',
  LATIOS: '라티오스',
  KYOGRE: '가이오가',
  GROUDON: '그란돈',
  RAYQUAZA: '레쿠쟈',
  JIRACHI: '지라치',
  DEOXYS: '테오키스',
  TURTWIG: '모부기',
  GROTLE: '수풀부기',
  TORTERRA: '토대부기',
  CHIMCHAR: '불꽃숭이',
  MONFERNO: '파이숭이',
  INFERNAPE: '초염몽',
  PIPLUP: '팽도리',
  PRINPLUP: '팽태자',
  EMPOLEON: '엠페르트',
  STARLY: '찌르꼬',
  STARAVIA: '찌르버드',
  STARAPTOR: '찌르호크',
  BIDOOF: '비버니',
  BIBAREL: '비버통',
  KRICKETOT: '귀뚤뚜기',
  KRICKETUNE: '귀뚤톡크',
  SHINX: '꼬링크',
  LUXIO: '럭시오',
  LUXRAY: '렌트라',
  BUDEW: '꼬몽울',
  ROSERADE: '로즈레이드',
  CRANIDOS: '두개도스',
  RAMPARDOS: '램펄드',
  SHIELDON: '방패톱스',
  BASTIODON: '바리톱스',
  BURMY: '도롱충이',
  WORMADAM: '도롱마담',
  MOTHIM: '나메일',
  COMBEE: '세꿀버리',
  VESPIQUEN: '비퀸',
  PACHIRISU: '파치리스',
  BUIZEL: '브이젤',
  FLOATZEL: '플로젤',
  CHERUBI: '체리버',
  CHERRIM: '체리꼬',
  SHELLOS: '깝질무',
  GASTRODON: '트리토돈',
  AMBIPOM: '겟핸보숭',
  DRIFLOON: '흔들풍손',
  DRIFBLIM: '둥실라이드',
  BUNEARY: '이어롤',
  LOPUNNY: '이어롭',
  MISMAGIUS: '무우마직',
  HONCHKROW: '돈크로우',
  GLAMEOW: '나옹마',
  PURUGLY: '몬냥이',
  CHINGLING: '랑딸랑',
  STUNKY: '스컹뿡',
  SKUNTANK: '스컹탱크',
  BRONZOR: '동미러',
  BRONZONG: '동탁군',
  BONSLY: '꼬지지',
  MIME_JR_: '흉내내',
  HAPPINY: '핑복',
  CHATOT: '페라페',
  SPIRITOMB: '화강돌',
  GIBLE: '딥상어동',
  GABITE: '한바이트',
  GARCHOMP: '한카리아스',
  MUNCHLAX: '먹고자',
  RIOLU: '리오르',
  LUCARIO: '루카리오',
  HIPPOPOTAS: '히포포타스',
  HIPPOWDON: '하마돈',
  SKORUPI: '스콜피',
  DRAPION: '드래피온',
  CROAGUNK: '삐딱구리',
  TOXICROAK: '독개굴',
  CARNIVINE: '무스틈니',
  FINNEON: '형광어',
  LUMINEON: '네오라이트',
  MANTYKE: '타만타',
  SNOVER: '눈쓰개',
  ABOMASNOW: '눈설왕',
  WEAVILE: '포푸니라',
  MAGNEZONE: '자포코일',
  LICKILICKY: '내룸벨트',
  RHYPERIOR: '거대코뿌리',
  TANGROWTH: '덩쿠림보',
  ELECTIVIRE: '에레키블',
  MAGMORTAR: '마그마번',
  TOGEKISS: '토게키스',
  YANMEGA: '메가자리',
  LEAFEON: '리피아',
  GLACEON: '글레이시아',
  GLISCOR: '글라이온',
  MAMOSWINE: '맘모꾸리',
  PORYGON_Z: '폴리곤Z',
  GALLADE: '엘레이드',
  PROBOPASS: '대코파스',
  DUSKNOIR: '야느와르몽',
  FROSLASS: '눈여아',
  ROTOM: '로토무',
  UXIE: '유크시',
  MESPRIT: '엠라이트',
  AZELF: '아그놈',
  DIALGA: '디아루가',
  PALKIA: '펄기아',
  HEATRAN: '히드런',
  REGIGIGAS: '레지기가스',
  GIRATINA: '기라티나',
  CRESSELIA: '크레세리아',
  PHIONE: '피오네',
  MANAPHY: '마나피',
  DARKRAI: '다크라이',
  SHAYMIN: '쉐이미',
  ARCEUS: '아르세우스',
  VICTINI: '비크티니',
  SNIVY: '주리비얀',
  SERVINE: '샤비',
  SERPERIOR: '샤로다',
  TEPIG: '뚜꾸리',
  PIGNITE: '챠오꿀',
  EMBOAR: '염무왕',
  OSHAWOTT: '수댕이',
  DEWOTT: '쌍검자비',
  SAMUROTT: '대검귀',
  PATRAT: '보르쥐',
  WATCHOG: '보르그',
  LILLIPUP: '요테리',
  HERDIER: '하데리어',
  STOUTLAND: '바랜드',
  PURRLOIN: '쌔비냥',
  LIEPARD: '레파르다스',
  PANSAGE: '야나프',
  SIMISAGE: '야나키',
  PANSEAR: '바오프',
  SIMISEAR: '바오키',
  PANPOUR: '앗차프',
  SIMIPOUR: '앗차키',
  MUNNA: '몽나',
  MUSHARNA: '몽얌나',
  PIDOVE: '콩둘기',
  TRANQUILL: '유토브',
  UNFEZANT: '켄호로우',
  BLITZLE: '줄뮤마',
  ZEBSTRIKA: '제브라이카',
  ROGGENROLA: '단굴',
  BOLDORE: '암트르',
  GIGALITH: '기가이어스',
  WOOBAT: '또르박쥐',
  SWOOBAT: '맘박쥐',
  DRILBUR: '두더류',
  EXCADRILL: '몰드류',
  AUDINO: '다부니',
  TIMBURR: '으랏차',
  GURDURR: '토쇠골',
  CONKELDURR: '노보청',
  TYMPOLE: '동챙이',
  PALPITOAD: '두까비',
  SEISMITOAD: '두빅굴',
  THROH: '던지미',
  SAWK: '타격귀',
  SEWADDLE: '두르보',
  SWADLOON: '두르쿤',
  LEAVANNY: '모아머',
  VENIPEDE: '마디네',
  WHIRLIPEDE: '휠구',
  SCOLIPEDE: '펜드라',
  COTTONEE: '소미안',
  WHIMSICOTT: '엘풍',
  PETILIL: '치릴리',
  LILLIGANT: '드레디어',
  BASCULIN: '배쓰나이',
  SANDILE: '깜눈크',
  KROKOROK: '악비르',
  KROOKODILE: '악비아르',
  DARUMAKA: '달막화',
  DARMANITAN: '불비달마',
  MARACTUS: '마라카치',
  DWEBBLE: '돌살이',
  CRUSTLE: '암팰리스',
  SCRAGGY: '곤율랭',
  SCRAFTY: '곤율거니',
  SIGILYPH: '심보러',
  YAMASK: '데스마스',
  COFAGRIGUS: '데스니칸',
  TIRTOUGA: '프로토가',
  CARRACOSTA: '늑골라',
  ARCHEN: '아켄',
  ARCHEOPS: '아케오스',
  TRUBBISH: '깨봉이',
  GARBODOR: '더스트나',
  ZORUA: '조로아',
  ZOROARK: '조로아크',
  MINCCINO: '치라미',
  CINCCINO: '치라치노',
  GOTHITA: '고디탱',
  GOTHORITA: '고디보미',
  GOTHITELLE: '고디모아젤',
  SOLOSIS: '유니란',
  DUOSION: '듀란',
  REUNICLUS: '란쿨루스',
  DUCKLETT: '꼬지보리',
  SWANNA: '스완나',
  VANILLITE: '바닐프티',
  VANILLISH: '바닐리치',
  VANILLUXE: '배바닐라',
  DEERLING: '사철록',
  SAWSBUCK: '바라철록',
  EMOLGA: '에몽가',
  KARRABLAST: '딱정곤',
  ESCAVALIER: '슈바르고',
  FOONGUS: '깜놀버슬',
  AMOONGUSS: '뽀록나',
  FRILLISH: '탱그릴',
  JELLICENT: '탱탱겔',
  ALOMOMOLA: '맘복치',
  JOLTIK: '파쪼옥',
  GALVANTULA: '전툴라',
  FERROSEED: '철시드',
  FERROTHORN: '너트령',
  KLINK: '기어르',
  KLANG: '기기어르',
  KLINKLANG: '기기기어르',
  TYNAMO: '저리어',
  EELEKTRIK: '저리릴',
  EELEKTROSS: '저리더프',
  ELGYEM: '리그레',
  BEHEEYEM: '벰크',
  LITWICK: '불켜미',
  LAMPENT: '램프라',
  CHANDELURE: '샹델라',
  AXEW: '터검니',
  FRAXURE: '액슨도',
  HAXORUS: '액스라이즈',
  CUBCHOO: '코고미',
  BEARTIC: '툰베어',
  CRYOGONAL: '프리지오',
  SHELMET: '쪼마리',
  ACCELGOR: '어지리더',
  STUNFISK: '메더',
  MIENFOO: '비조푸',
  MIENSHAO: '비조도',
  DRUDDIGON: '크리만',
  GOLETT: '골비람',
  GOLURK: '골루그',
  PAWNIARD: '자망칼',
  BISHARP: '절각참',
  BOUFFALANT: '버프론',
  RUFFLET: '수리둥보',
  BRAVIARY: '워글',
  VULLABY: '벌차이',
  MANDIBUZZ: '버랜지나',
  HEATMOR: '앤티골',
  DURANT: '아이앤트',
  DEINO: '모노두',
  ZWEILOUS: '디헤드',
  HYDREIGON: '삼삼드래',
  LARVESTA: '활화르바',
  VOLCARONA: '불카모스',
  COBALION: '코바르온',
  TERRAKION: '테라키온',
  VIRIZION: '비리디온',
  TORNADUS: '토네로스',
  THUNDURUS: '볼트로스',
  RESHIRAM: '레시라무',
  ZEKROM: '제크로무',
  LANDORUS: '랜드로스',
  KYUREM: '큐레무',
  KELDEO: '케르디오',
  MELOETTA: '메로엣타',
  GENESECT: '게노세크트',
  CHESPIN: '도치마론',
  QUILLADIN: '도치보구',
  CHESNAUGHT: '브리가론',
  FENNEKIN: '푸호꼬',
  BRAIXEN: '테르나',
  DELPHOX: '마폭시',
  FROAKIE: '개구마르',
  FROGADIER: '개굴반장',
  GRENINJA: '개굴닌자',
  BUNNELBY: '파르빗',
  DIGGERSBY: '파르토',
  FLETCHLING: '화살꼬빈',
  FLETCHINDER: '불화살빈',
  TALONFLAME: '파이어로',
  SCATTERBUG: '분이벌레',
  SPEWPA: '분떠도리',
  VIVILLON: '비비용',
  LITLEO: '레오꼬',
  PYROAR: '화염레오',
  FLAB_B_: '플라베베',
  FLOETTE: '플라엣테',
  FLORGES: '플라제스',
  SKIDDO: '메이클',
  GOGOAT: '고고트',
  PANCHAM: '판짱',
  PANGORO: '부란다',
  FURFROU: '트리미앙',
  ESPURR: '냐스퍼',
  MEOWSTIC: '냐오닉스',
  HONEDGE: '단칼빙',
  DOUBLADE: '쌍검킬',
  AEGISLASH: '킬가르도',
  SPRITZEE: '슈쁘',
  AROMATISSE: '프레프티르',
  SWIRLIX: '나룸퍼프',
  SLURPUFF: '나루림',
  INKAY: '오케이징',
  MALAMAR: '칼라마네로',
  BINACLE: '거북손손',
  BARBARACLE: '거북손데스',
  SKRELP: '수레기',
  DRAGALGE: '드래캄',
  CLAUNCHER: '완철포',
  CLAWITZER: '블로스터',
  HELIOPTILE: '목도리키텔',
  HELIOLISK: '일레도리자드',
  TYRUNT: '티고라스',
  TYRANTRUM: '견고라스',
  AMAURA: '아마루스',
  AURORUS: '아마루르가',
  SYLVEON: '님피아',
  HAWLUCHA: '루차불',
  DEDENNE: '데덴네',
  CARBINK: '멜리시',
  GOOMY: '미끄메라',
  SLIGGOO: '미끄네일',
  GOODRA: '미끄래곤',
  KLEFKI: '클레피',
  PHANTUMP: '나목령',
  TREVENANT: '대로트',
  PUMPKABOO: '호바귀',
  GOURGEIST: '펌킨인',
  BERGMITE: '꽁어름',
  AVALUGG: '크레베이스',
  NOIBAT: '음뱃',
  NOIVERN: '음번',
  XERNEAS: '제르네아스',
  YVELTAL: '이벨타르',
  ZYGARDE: '지가르데',
  DIANCIE: '디안시',
  HOOPA: '후파',
  VOLCANION: '볼케니온',
  ROWLET: '나몰빼미',
  DARTRIX: '빼미스로우',
  DECIDUEYE: '모크나이퍼',
  LITTEN: '냐오불',
  TORRACAT: '냐오히트',
  INCINEROAR: '어흥염',
  POPPLIO: '누리공',
  BRIONNE: '키요공',
  PRIMARINA: '누리레느',
  PIKIPEK: '콕코구리',
  TRUMBEAK: '크라파',
  TOUCANNON: '왕큰부리',
  YUNGOOS: '영구스',
  GUMSHOOS: '형사구스',
  GRUBBIN: '턱지충이',
  CHARJABUG: '전지충이',
  VIKAVOLT: '투구뿌논',
  CRABRAWLER: '오기지게',
  CRABOMINABLE: '모단단게',
  ORICORIO: '춤추새',
  CUTIEFLY: '에블리',
  RIBOMBEE: '에리본',
  ROCKRUFF: '암멍이',
  LYCANROC: '루가루암',
  WISHIWASHI: '약어리',
  MAREANIE: '시마사리',
  TOXAPEX: '더시마사리',
  MUDBRAY: '머드나기',
  MUDSDALE: '만마드',
  DEWPIDER: '물거미',
  ARAQUANID: '깨비물거미',
  FOMANTIS: '짜랑랑',
  LURANTIS: '라란티스',
  MORELULL: '자마슈',
  SHIINOTIC: '마셰이드',
  SALANDIT: '야도뇽',
  SALAZZLE: '염뉴트',
  STUFFUL: '포곰곰',
  BEWEAR: '이븐곰',
  BOUNSWEET: '달콤아',
  STEENEE: '달무리나',
  TSAREENA: '달코퀸',
  COMFEY: '큐아링',
  ORANGURU: '하랑우탄',
  PASSIMIAN: '내던숭이',
  WIMPOD: '꼬시레',
  GOLISOPOD: '갑주무사',
  SANDYGAST: '모래꿍',
  PALOSSAND: '모래성이당',
  PYUKUMUKU: '해무기',
  TYPE__NULL: '타입:널',
  SILVALLY: '실버디',
  MINIOR: '메테노',
  KOMALA: '자말라',
  TURTONATOR: '폭거북스',
  TOGEDEMARU: '토게데마루',
  MIMIKYU: '따라큐',
  BRUXISH: '치갈기',
  DRAMPA: '할비롱',
  DHELMISE: '타타륜',
  JANGMO_O: '짜랑꼬',
  HAKAMO_O: '짜랑고우',
  KOMMO_O: '짜랑고우거',
  TAPU_KOKO: '카푸꼬꼬꼭',
  TAPU_LELE: '카푸나비나',
  TAPU_BULU: '카푸브루루',
  TAPU_FINI: '카푸느지느',
  COSMOG: '코스모그',
  COSMOEM: '코스모움',
  SOLGALEO: '솔가레오',
  LUNALA: '루나아라',
  NIHILEGO: '텅비드',
  BUZZWOLE: '매시붕',
  PHEROMOSA: '페로코체',
  XURKITREE: '전수목',
  CELESTEELA: '철화구야',
  KARTANA: '종이신도',
  GUZZLORD: '악식킹',
  NECROZMA: '네크로즈마',
  MAGEARNA: '마기아나',
  MARSHADOW: '마샤도',
  POIPOLE: '베베놈',
  NAGANADEL: '아고용',
  STAKATAKA: '차곡차곡',
  BLACEPHALON: '두파팡',
  ZERAORA: '제라오라',
  MELTAN: '멜탄',
  MELMETAL: '멜메탈',
  GROOKEY: '흥나숭',
  THWACKEY: '채키몽',
  RILLABOOM: '고릴타',
  SCORBUNNY: '염버니',
  RABOOT: '래비풋',
  CINDERACE: '에이스번',
  SOBBLE: '울머기',
  DRIZZILE: '누겔레온',
  INTELEON: '인텔리레온',
  SKWOVET: '탐리스',
  GREEDENT: '요씽리스',
  ROOKIEDEE: '파라꼬',
  CORVISQUIRE: '파크로우',
  CORVIKNIGHT: '아머까오',
  BLIPBUG: '두루지벌레',
  DOTTLER: '레돔벌레',
  ORBEETLE: '이올브',
  NICKIT: '훔처우',
  THIEVUL: '폭슬라이',
  GOSSIFLEUR: '꼬모카',
  ELDEGOSS: '백솜모카',
  WOOLOO: '우르',
  DUBWOOL: '배우르',
  CHEWTLE: '깨물부기',
  DREDNAW: '갈가부기',
  YAMPER: '멍파치',
  BOLTUND: '펄스멍',
  ROLYCOLY: '탄동',
  CARKOL: '탄차곤',
  COALOSSAL: '석탄산',
  APPLIN: '과사삭벌레',
  FLAPPLE: '애프룡',
  APPLETUN: '단지래플',
  SILICOBRA: '모래뱀',
  SANDACONDA: '사다이사',
  CRAMORANT: '윽우지',
  ARROKUDA: '찌로꼬치',
  BARRASKEWDA: '꼬치조',
  TOXEL: '일레즌',
  TOXTRICITY: '스트린더',
  SIZZLIPEDE: '태우지네',
  CENTISKORCH: '다태우지네',
  CLOBBOPUS: '때때무노',
  GRAPPLOCT: '케오퍼스',
  SINISTEA: '데인차',
  POLTEAGEIST: '포트데스',
  HATENNA: '몸지브림',
  HATTREM: '손지브림',
  HATTERENE: '브리무음',
  IMPIDIMP: '메롱꿍',
  MORGREM: '쏘겨모',
  GRIMMSNARL: '오롱털',
  OBSTAGOON: '가로막구리',
  PERRSERKER: '나이킹',
  CURSOLA: '산호르곤',
  SIRFETCH_D: '창파나이트',
  MR__RIME: '마임꽁꽁',
  RUNERIGUS: '데스판',
  MILCERY: '마빌크',
  ALCREMIE: '마휘핑',
  FALINKS: '대여르',
  PINCURCHIN: '찌르성게',
  SNOM: '누니머기',
  FROSMOTH: '모스노우',
  STONJOURNER: '돌헨진',
  EISCUE: '빙큐보',
  INDEEDEE: '에써르',
  MORPEKO: '모르페코',
  CUFANT: '끼리동',
  COPPERAJAH: '대왕끼리동',
  DRACOZOLT: '파치래곤',
  ARCTOZOLT: '파치르돈',
  DRACOVISH: '어래곤',
  ARCTOVISH: '어치르돈',
  DURALUDON: '두랄루돈',
  DREEPY: '드라꼰',
  DRAKLOAK: '드래런치',
  DRAGAPULT: '드래펄트',
  ZACIAN: '자시안',
  ZAMAZENTA: '자마젠타',
  ETERNATUS: '무한다이노',
  KUBFU: '치고마',
  URSHIFU: '우라오스',
  CALYREX: '버드렉스',
  ZARUDE: '자루도',
  REGIELEKI: '레지에레키',
  REGIDRAGO: '레지드래고',
} as const;
export type POKEMON = typeof POKEMON[keyof typeof POKEMON];

export type UtilString = {
  getName: string;
  getTypes: string;
  getAbility: string;
  getEvYield: string;
  getEggGroups: string;
  getGender: string;
  getEggCycles: string;
  getStats: string;
  getTypeDefenses: string;
};
