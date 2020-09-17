import { getBrowserAndPage, IWindow } from '@/utils';
import { Page } from 'puppeteer';
import {
  AreaConditionType,
  AreaType,
  ConditionType,
  EvolutionType,
  FormType,
  IEvolutionChain,
  IEvolvingTo,
  IPokemon,
  OtherConditionType,
  StoneType,
  TradingConditionType,
} from './types';

declare let window: IWindow;

const hasText = (text: string) => (regExpString: string): boolean => new RegExp(regExpString, 'gi').test(text);
const evolutionUtil = async (page: Page): Promise<void> => {
  await page.evaluate((formType: typeof FormType) => {
    const convertDifferentForm = (differentForm: string | null): string | null => {
      if (!differentForm) return null;

      const ExclusionForm = /Male|Rockruff|Shield/.test(differentForm);
      if (ExclusionForm) return null;

      const hasDifferentForm = (regExpString: string) => new RegExp(regExpString, 'gi').test(differentForm);
      if (hasDifferentForm('Galarian Standard')) return formType.ALOLA_DARMANITAN_STANDARD;
      if (hasDifferentForm('Alola')) return formType.ALOLA;
      if (hasDifferentForm('Galar')) return formType.GALAR;
      if (hasDifferentForm('Plant')) return formType.WORMADAM_GRASS;
      if (hasDifferentForm('Sandy')) return formType.WORMADAM_CAVES;
      if (hasDifferentForm('Trash')) return formType.WORMADAM_BUILDINGS;
      if (hasDifferentForm('Low')) return formType.TOXTRICITY_LOW;
      if (hasDifferentForm('Amped')) return formType.TOXTRICITY_HIGH;
      if (hasDifferentForm('Standard')) return formType.DARMANITAN_STANDARD;
      if (hasDifferentForm('Midday')) return formType.ROCKRUFF_MID_DAY;
      if (hasDifferentForm('Midnight')) return formType.ROCKRUFF_MID_NIGHT;
      if (hasDifferentForm('Dusk')) return formType.ROCKRUFF_DUSK;
      if (hasDifferentForm('Single')) return formType.URSHIFU_SINGLE;
      if (hasDifferentForm('Rapid')) return formType.URSHIFU_RAPID;
      return null;
    };

    window.getPokemons = (el: NodeListOf<Element>): IPokemon[] => {
      return Array.from(el).map($td => {
        const name = $td.querySelector('.ent-name')!.textContent!;
        const image = $td.querySelector('.icon-pkmn')!.getAttribute('data-src')!;
        const differentForm = $td.querySelector('.text-muted')?.textContent ?? null;

        return { name, image, differentForm: convertDifferentForm(differentForm) };
      });
    };
    window.addEvolutionFrom = (acc: IEvolutionChain[], from: IPokemon, to: IEvolvingTo): IEvolutionChain[] => {
      const fromIndex = acc.findIndex(p => p.name === from.name);
      acc[fromIndex].evolvingTo.push(to);
      return acc;
    };
  }, FormType);
};

const getLevelCondition = (condition: string): string => {
  const hasCondition = hasText(condition);
  if (!condition || hasCondition('outside')) return '';

  if (hasCondition('Day')) return ConditionType.DAY;
  if (hasCondition('Night')) return ConditionType.NIGHT;
  if (hasCondition('Male')) return ConditionType.MALE;
  if (hasCondition('Female')) return ConditionType.FEMALE;
  if (hasCondition('empty spot in party')) return OtherConditionType.EMPTY_PARTY;
  if (hasCondition('during rain')) return OtherConditionType.RAIN;
  if (hasCondition('dusk')) return `${OtherConditionType.DUSK}`;
  if (hasCondition('Galar')) return AreaConditionType.GALAR;
  if (hasCondition('Sun or Ultra Sun')) return AreaConditionType.SUN_OR_ULTRA_SUN;
  if (hasCondition('Moon or Ultra Moon')) return AreaConditionType.MOON_OR_ULTRA_MOON;
  if (hasCondition('upside down')) return OtherConditionType.UPSIDE_DOWN;
  if (hasCondition('Dark type Pokémon in party')) return OtherConditionType.DARK_PARTY;
  if (hasCondition('low')) return OtherConditionType.TOXTRICITY_LOW;
  if (hasCondition('amped')) return OtherConditionType.TOXTRICITY_HIGH;
  if (hasCondition('random')) return OtherConditionType.RANDOM;
  if (hasCondition('Attack > Defense')) return OtherConditionType.HIGH_ATTACK;
  if (hasCondition('Attack < Defense')) return OtherConditionType.LOW_ATTACK;
  if (hasCondition('Attack = Defense')) return OtherConditionType.SAME_ATTACK;

  return condition;
};
const getLevelAdditionalCondition = (area: string): string => {
  const hasArea = hasText(area);
  if (!area) return '';

  if (hasArea('Alola')) return ` ${AreaType.ALOLA}에서`;
  if (hasArea('galar')) return ` ${AreaType.GALAR}에서`;
  if (hasArea('grass')) return ` ${AreaType.GRASS}애서`;
  if (hasArea('caves')) return ` ${AreaType.CAVES}애서`;
  if (hasArea('buildings')) return ` ${AreaType.BUILDINGS}애서`;
  if (hasArea('Sun or Ultra Sun')) return ` ${AreaType.SUN_OR_ULTRA_SUN}에서`;
  if (hasArea('Moon or Ultra Moon')) return ` ${AreaType.MOON_OR_ULTRA_MOON}에서`;
  if (hasArea('Ultra Sun/Moon')) return ` ${AreaType.ULTRA_SUN_OR_ULTRA_MOON}에서`;
  if (hasArea('Pokéball in bag')) return ` 가방에 ${AreaType.POKEBALL}을 가지고 있고`;
  return area;
};

const getTradingCondition = (condition: string): string => {
  const hasCondition = hasText(condition);
  if (!condition) return '통신교환';

  if (hasCondition('Kings Rock')) return TradingConditionType.KINGS_ROCK;
  if (hasCondition('Metal Coat')) return TradingConditionType.METAL_COAT;
  if (hasCondition('Protector')) return TradingConditionType.PROTECTOR;
  if (hasCondition('Dragon Scale')) return TradingConditionType.DRAGON_SCALE;
  if (hasCondition('Electirizer')) return TradingConditionType.ELECTIRIZER;
  if (hasCondition('Magmarizer')) return TradingConditionType.MAGMARIZER;
  if (hasCondition('Upgrade')) return TradingConditionType.UPGRADE;
  if (hasCondition('Dubious Disc')) return TradingConditionType.DUBIOUS_DISC;
  if (hasCondition('Prism Scale')) return TradingConditionType.PRISM_SCALE;
  if (hasCondition('Reaper Cloth')) return TradingConditionType.REAPER_CLOTH;
  if (hasCondition('Deep Sea Tooth')) return TradingConditionType.DEEP_SEA_TOOTH;
  if (hasCondition('Deep Sea Scale')) return TradingConditionType.DEEP_SEA_SCALE;
  if (hasCondition('with Shelmet')) return TradingConditionType.WITH_SHELMET;
  if (hasCondition('with Karrablast')) return TradingConditionType.WITH_KARRABLAST;
  if (hasCondition('Sachet')) return TradingConditionType.SACHET;
  if (hasCondition('Whipped Dream')) return TradingConditionType.WHIPPED_DREAM;

  return condition;
};

const getStoneCondition = (stone: string): string => {
  const key = Object.keys(StoneType).find(key => new RegExp(key, 'gi').test(stone)) as keyof typeof StoneType;
  return StoneType[key];
};
const getStoneAdditionalCondition = (condition: string): string => {
  const hasCondition = hasText(condition);
  if (!condition || hasCondition('outside')) return '';

  if (hasCondition('Alola')) return `${AreaType.ALOLA}에서`;
  if (hasCondition('Female')) return `${ConditionType.FEMALE}`;
  if (hasCondition('Male')) return `${ConditionType.FEMALE}`;
  if (hasCondition('level up in a Magnetic Field area')) return '또는 포니대협곡 또는 화끈산 에서 레벨업';

  return condition;
};

const getFriendshipCondition = (condition: string): string => {
  const hasCondition = hasText(condition);
  const friendshipText = '친밀도가 220 이상';
  if (!condition) return `${friendshipText}일 때 레벨업`;

  if (hasCondition('Day')) return `${friendshipText}이고 ${ConditionType.DAY}`;
  if (hasCondition('Night')) return `${friendshipText}이고 ${ConditionType.NIGHT}`;

  return condition;
};

const levelCondition = (conditions: string): string[] => {
  const [c1, c2] = conditions.split(',');
  const condition = getLevelCondition(c1);
  const additionalCondition = getLevelAdditionalCondition(c2);

  return [`${condition}${additionalCondition}`].filter(c => c);
};

const elementalStoneCondition = (conditions: string): string[] => {
  const [c1, ...c] = conditions.split(',');
  const condition = `${getStoneCondition(c1)} 사용`;
  const additionalCondition = getStoneAdditionalCondition(c.join(','));

  return [condition, additionalCondition].filter(c => c);
};

const tradingCondition = (condition: string): string[] => [getTradingCondition(condition)];

const friendshipCondition = (condition: string): string[] => [getFriendshipCondition(condition)];

const crawling = (elements: Element[], type: string): IEvolutionChain[] =>
  elements.reduce<IEvolutionChain[]>((acc, $tr) => {
    const [from, to] = window.getPokemons($tr.querySelectorAll('.cell-name'));
    const level = $tr.querySelector('.cell-num')?.textContent ?? null;
    const condition = $tr.querySelector('.cell-med-text')?.textContent ?? '';
    const evolvingTo = { ...to, type, condition: [level, condition] } as IEvolvingTo;

    const isDuplicatePokemon = acc.some(p => p.name === from.name && !from.differentForm);
    if (isDuplicatePokemon) return window.addEvolutionFrom(acc, from, evolvingTo);

    return [...acc, { ...from, evolvingTo: [evolvingTo] }];
  }, []);

const convertEvolutionCondition = (type: string, crawlingData: IEvolutionChain[]): IEvolutionChain[] => {
  return crawlingData.map(data => ({
    ...data,
    evolvingTo: data.evolvingTo.map(to => {
      const [level, condition] = to.condition;
      switch (type) {
        case EvolutionType.LEVEL:
          return { ...to, condition: [level, ...levelCondition(condition)] };
        case EvolutionType.STONE:
          return { ...to, condition: elementalStoneCondition(condition) };
        case EvolutionType.TRADE:
          return { ...to, condition: tradingCondition(condition) };
        case EvolutionType.FRIENDSHIP:
          return { ...to, condition: friendshipCondition(condition) };
        default:
          return to;
      }
    }),
  }));
};

export const getEvolutionChains = async (type: string): Promise<IEvolutionChain[]> => {
  const url = `https://pokemondb.net/evolution/${type}`;
  const waitForSelector = '#evolution > tbody';

  const { browser, page } = await getBrowserAndPage(url, waitForSelector);
  await evolutionUtil(page);

  const crawlingData = await page.$$eval('#evolution > tbody > tr', crawling, type);
  await browser.close();

  return convertEvolutionCondition(type, crawlingData);
};
