export const otherCondition = {
  LEVEL_UP_IN_A_MAGNETIC_FIELD_AREA:
    '천관산(DPPt), 전기돌동굴(BW/BW2), 13번 도로-발전소가 있는 곳(XY), 뉴보라(ORAS), 포니대협곡(SM/USUM), 화끈산(USUM)에서 레벨업',
  AFTER_ROLLOUT_LEARNED: '구르기를 배운뒤 레벨업',
  AFTER_ANCIENT_POWER_LEARNED: '원시의힘을 배운 뒤 레벨업',
  AFTER_MIMIC_LEARNED: '흉내내기를 배운 뒤 레벨업',
  LEVEL_UP_NEAR_A_MOSSY_ROCK: '4-7세대: 이끼 바위에서 레벨업, 8세대: 리프의돌 사용',
  LEVEL_UP_NEAR_AN_ICY_ROCK: '4-7세대: 얼음 바위에서 레벨업, 8세대: 얼음의돌 사용',
  AFFECTION_IN_POKEMON_AMIE:
    '6-7세대: 포켓파를레/포켓리프레 절친도가 2단계 이상일 때 레벨업, 8세대: 친밀도 220+ 레벨업',
  KNOWING_FAIRY_MOVE: '페어리 타입 기술을 배우고',
  AFTER_DOUBLE_HIT_LEARNED: '더블어택을 배운 뒤 레벨업',
  HOLD_OVAL_STONE: '둥글둥글돌을 지니고 레벨업',
  HOLD_RAZOR_FANG: '예리한 이빨을 지니고 레벨업',
  HOLD_RAZOR_CLAW: '예리한 손톱을 지니고 레벨업',
  WITH_REMORAID_IN_PARTY: '파티에 총어가 있을 때 레벨 업',
  TRADE_HOLDING_PRISM_SCALE:
    '3세대: 아름다움 수치 230 이상 레벨업, 4세대: 아름다움 수치 MAX 상태에서 레벨 업, 5세대 이후: 고운비늘을 지니고 통신교환',
  NEAR_DUSTY_BOWL:
    '49이상의 대미지 누적을 받은 후 와일드에리어 모래먼지구덩이에 있는 고인돌 형태의 바위 아래로 통과(상대 포켓몬에게 직접 받은 대미지만 가능하며 기절하면 초기화)',
  AT_MOUNT_LANAKILA: '라나키라마운틴에서 레벨업',
  AFTER_STOMP_LEARNED: '짓밝기를 배운 뒤 레벨업',
  AFTER_DRAGON_PULSE_LEARNED: '용의파동을 배운 뒤 레벨업',
  POKEMON_GO_ONLY: '포켓몬 GO에서 사탕 400개를 이용해 진화',
  SPIN_AROUND_HOLDING_SWEET: '사탕공예를 지니게 하고 L스틱으로 캐릭터를 회전시킨다',
  ACHIEVE_3_CRITICAL_HITS_IN_ONE_BATTLE: '한 배틀에서 상대의 급소를 3번 맞춘다.',
  AFTER_TAUNT_LEARNED: '도발을 배운 뒤 레벨업',
  IN_TOWER_OF_DARKNESS: '악의탑 제페',
  IN_TOWER_OF_WATER: '물의탑 제패',
} as const;
export type OtherCondition = typeof otherCondition[keyof typeof otherCondition];
