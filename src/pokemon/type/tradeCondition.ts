export const tradeCondition = {
  KINGS_ROCK: '왕의징표석을 지니게 한 뒤',
  METAL_COAT: '금속코트를 지니게 한 뒤',
  PROTECTOR: '프로텍터를 지니게 한 뒤',
  DRAGON_SCALE: '용의비늘을 지니게 한 뒤',
  ELECTIRIZER: '에레키부스터를 지니게 한 뒤',
  MAGMARIZER: '마그마부스터를 지니게 한 뒤',
  UPGRADE: '업그레이드를 지니게 한 뒤',
  DUBIOUS_DISC: '괴상한패치를 지니게 한 뒤',
  PRISM_SCALE:
    '3세대: 아름다움 수치 230 이상 레벨업, 4세대: 아름다움 수치 MAX 상태에서 레벨 업, 5세대 이후: 고운비늘을 지니게 한 뒤',
  REAPER_CLOTH: '영계의천을 지니게 한 뒤',
  DEEP_SEA_TOOTH: '심해의이빨을 지니게 한 뒤',
  DEEP_SEA_SCALE: '심해의비늘을 지니게 한 뒤',
  TRADE_WITH_SHELMET: '쪼마리와',
  TRADE_WITH_KARRABLAST: '딱정곤과',
  SACHET: '향기주머니를 지니게 한 뒤',
  WHIPPED_DREAM: '휘핑팝을 지니게 한 뒤',
} as const;
export type TradeCondition = typeof tradeCondition[keyof typeof tradeCondition];
