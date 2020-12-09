export enum FormNames {
  MEGA_X = '메가진화X',
  MEGA_Y = '메가진화Y',
  MEGA = '메가진화',
  DYNAMAX = '거다이맥스',
  GALARIAN_STANDARD_MODE = '가라르 폼',
  GALARIAN_ZEN_MODE = '가라르 폼 달마모드',
  ALOLA_FORM = '알로라 폼',
  GALAR_FORM = '가라르 폼',
  SUNNY_FORM = '태양의 모습',
  RAINY_FORM = '빗방울의 모습',
  SNOWY_FORM = '설운의 모습',
  PRIMAL = '원시회귀',
  NORMAL_FORM = '노말 폼',
  ATTACK_FORM = '어택 폼',
  DEFENSE_FORM = '디펜스 폼',
  SPEED_FORM = '스피드 폼',
  PLANT_CLOAK = '초목도롱',
  SANDY_CLOAK = '모래땅도롱',
  TRASH_CLOAK = '슈레도롱',
  HEAT_ROTOM = '히트로토무',
  WASH_ROTOM = '워시로토무',
  FROST_ROTOM = '프로스트로토무',
  FAN_ROTOM = '스핀로토무',
  MOW_ROTOM = '커트로토무',
  ALTERED_FORM = '어나더 폼',
  ORIGIN_FORM = '오리진 폼',
  LAND_FORM = '랜드 폼',
  SKY_FORM = '스카이 폼',
  STANDARD_MODE = '노말 폼',
  ZEN_MODE = '달마모드',
  INCARNATE_FORM = '화신 폼',
  THERIAN_FORM = '영물 폼',
  BLACK_KYUREM = '블랙큐레무',
  WHITE_KYUREM = '화이트큐레무',
  ORDINARY_FORM = '평소의모습',
  RESOLUTE_FORM = '각오의모습',
  ARIA_FORM = '보이스 폼',
  PIROUETTE_FORM = '스텝 폼',
  ASH_GRENINJA = '지우개굴닌자',
  SHIELD_FORM = '실드 폼',
  BLADE_FORM = '블레이드 폼',
  AVERAGE_SIZE = '일반 크기',
  SMALL_SIZE = '작은 크기',
  LARGE_SIZE = '큰 크기',
  SUPER_SIZE = '아주 큰 크기',
  '50_FORM' = '50% 폼',
  '10_FORM' = '10% 폼',
  COMPLETE_FORM = '퍼펙트 폼',
  HOOPA_CONFINED = '굴레에 빠진 후파',
  HOOPA_UNBOUND = '굴레를 벗어난 후파',
  BAILE_STYLE = '이글이글 스타일',
  POM_POM_STYLE = '파칙파칙 스타일',
  PA_U_STYLE = '훌라훌라 스타일',
  SENSU_STYLE = '하늘하늘 스타일',
  MIDDAY_FORM = '한낮의 모습',
  MIDNIGHT_FORM = '한밤중의 모습',
  DUSK_FORM = '황혼의 모습',
  SOLO_FORM = '단독의 모습',
  SCHOOL_FORM = '군집의 모습',
  METEOR_FORM = '유성의 모습',
  CORE_FORM = '코어의 모습',
  DUSK_MANE_NECROZMA = '황혼의 갈기',
  DAWN_WINGS_NECROZMA = '새벽의 날개',
  ULTRA_NECROZMA = '울트라네크로즈마',
  LOW_KEY_FORM = '로우한 모습',
  AMPED_FORM = '하이한 모습',
  ICE_FACE = '아이스 페이스',
  NOICE_FACE = '나이스 페이스',
  FULL_BELLY_MODE = '배부른 모습',
  HANGRY_MODE = '배고픈 모습',
  HERO_OF_MANY_BATTLES = '역전의 용사',
  CROWNED_SWORD = '검왕',
  CROWNED_SHIELD = '방패왕',
  ETERNAMAX = '무한다이맥스',
  SINGLE_STRIKE_STYLE = '일격의 태세',
  RAPID_STRIKE_STYLE = '연격의 태세',
  MALE = '수컷',
  FEMALE = '암컷',
  OWN_TEMPO_ROCKRUFF = '마이페이스 암멍이',
  RED_STRIPED_FORM = '적색근의 모습',
  BLUE_STRIPED_FORM = '청색근의 모습',
  WEST_SEA = '서쪽의 모습',
  EAST_SEA = '동쪽의 모습',
  SPRING_FORM = '봄의 모습',
  SUMMER_FORM = '여름의 모습',
  AUTUMN_FORM = '가을의 모습',
  WINTER_FORM = '겨울의 모습',
  OVERCAST_FORM = '네거 폼',
  SUNSHINE_FORM = '포지 폼',
  ORIGINAL_COLOR = '500년전의 색',
  DADA = '아빠',
}
export type FormName = typeof FormNames[keyof typeof FormNames];
