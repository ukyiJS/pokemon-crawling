import { getBrowserAndPage, IWindow } from '@/utils';
import { Page } from 'puppeteer';
import { IEvolutionChain, IEvolvingTo, IPokemon } from '../pokemon.interface';
import {
  AbilityConditionType,
  AreaConditionType,
  AreaType,
  ConditionType,
  EvolutionType,
  FormType,
  ItemConditionType,
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
        const name = $td.querySelector('.ent-name')!.textContent!.replace(/\s/g, '');
        const $image = $td.querySelector('.icon-pkmn');
        const image = $image!.getAttribute('data-src') ?? ($image as HTMLImageElement).src;
        const differentForm = $td.querySelector('.text-muted')?.textContent ?? null;
        return { name, image, differentForm };
      });
    };
    window.hasExclusionPokemon = (level: string | null, condition: string): boolean =>
      /use|random|trade|empty/.test(condition) || !!level;
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

const getOtherCondition = (condition: string): string => {
  const hasCondition = hasText(condition);
  if (!condition || hasCondition('outside')) return '';

  if (hasCondition('Magnetic Field')) return AreaConditionType.MAGNETIC_FIELD;
  if (hasCondition('Rollout')) return AbilityConditionType.ROLLOUT;
  if (hasCondition('Oval Stone')) return ItemConditionType.OVAL_STONE;
  if (hasCondition('Ancient Power')) return AbilityConditionType.ANCIENT_POWER;
  if (hasCondition('Mimic')) return AbilityConditionType.MIMIC;
  if (hasCondition('Mossy Rock')) return AreaConditionType.MOSSY_ROCK;
  if (hasCondition('Icy Rock')) return AreaConditionType.ICY_ROCK;
  if (hasCondition('Affection')) return OtherConditionType.AFFECTION;
  if (hasCondition('Double Hit')) return AbilityConditionType.DOUBLE_HIT;
  if (hasCondition('Razor Fang')) return ItemConditionType.RAZOR_FANG;
  if (hasCondition('Razor Claw')) return ItemConditionType.RAZOR_CLAW;
  if (hasCondition('Remoraid')) return OtherConditionType.WITH_REMORAID;
  if (hasCondition('Dusty Bowl')) return AreaConditionType.NEAR_DUSTY_BOWL;
  if (hasCondition('Mount Lanakila')) return AreaConditionType.MOUNT_LANAKILA;
  if (hasCondition('Stomp')) return AbilityConditionType.STOMP;
  if (hasCondition('Dragon Pulse')) return AbilityConditionType.DRAGON_PULSE;
  if (hasCondition('Meltan')) return OtherConditionType.MELMETAL;
  if (hasCondition('Sweet')) return ItemConditionType.SWEET;
  if (hasCondition('critical')) return OtherConditionType.CRITICAL_HITS;
  if (hasCondition('Taunt')) return AbilityConditionType.TAUNT;
  if (hasCondition('in Tower of Darkness')) return OtherConditionType.IN_TOWER_OF_DARKNESS;
  if (hasCondition('in Tower of Water')) return OtherConditionType.IN_TOWER_OF_WATER;

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

const otherCondition = (condition: string): string[] => [getOtherCondition(condition)];

const crawling = (elements: Element[], type: string): IEvolutionChain[] =>
  elements.reduce<IEvolutionChain[]>((acc, $tr) => {
    const [from, to] = window.getPokemons($tr.querySelectorAll('.cell-name'));
    const level = $tr.querySelector('.cell-num')?.textContent ?? null;
    const condition = $tr.querySelector('.cell-med-text')?.textContent ?? '';

    if (type === 'status' && window.hasExclusionPokemon(level, condition)) return acc;

    const evolvingTo = { ...to, type, condition: [level, condition] } as IEvolvingTo;

    const isDuplicatePokemon = acc.some(p => p.name === from.name && !from.differentForm);
    if (isDuplicatePokemon) return window.addEvolutionFrom(acc, from, evolvingTo);

    const preIndex = acc.findIndex(({ evolvingTo }) => evolvingTo.some(({ name }) => name === from.name));
    if (preIndex > -1) {
      acc[preIndex].evolvingTo = acc[preIndex].evolvingTo.map(e => ({ ...e, evolvingTo: [evolvingTo] }));
      return acc;
    }
    return [...acc, { ...from, evolvingTo: [evolvingTo] }];
  }, []);

const convertEvolutionCondition = (type: string, crawlingData: IEvolutionChain[]): IEvolutionChain[] => {
  const getEvolvingTo = (evolvingTo: IEvolvingTo[]): IEvolvingTo[] => {
    return evolvingTo.map(to => {
      const [level, condition] = to.condition!;
      switch (type) {
        case EvolutionType.LEVEL:
          to.condition = [level, ...levelCondition(condition)];
          break;
        case EvolutionType.STONE:
          to.condition = elementalStoneCondition(condition);
          break;
        case EvolutionType.TRADE:
          to.condition = tradingCondition(condition);
          break;
        case EvolutionType.FRIENDSHIP:
          to.condition = friendshipCondition(condition);
          break;
        case EvolutionType.STATUS:
          to.condition = otherCondition(condition);
          break;
        default:
          break;
      }
      to.evolvingTo = to.evolvingTo ? getEvolvingTo(to.evolvingTo) : [];
      return to;
    });
  };

  return crawlingData.map(data => ({ ...data, evolvingTo: getEvolvingTo(data.evolvingTo) }));
};

const evolutionCrawling = async (type: string): Promise<IEvolutionChain[]> => {
  const url = `https://pokemondb.net/evolution/${type}`;
  const waitForSelector = '#evolution > tbody';
  const { browser, page } = await getBrowserAndPage(url, waitForSelector);
  await evolutionUtil(page);

  const crawlingData = await page.$$eval('#evolution > tbody > tr', crawling, type);
  await browser.close();
  return convertEvolutionCondition(type, crawlingData);
};
const withoutEvolutionCrawling = async (): Promise<IEvolutionChain[]> => {
  const url = 'https://pokemondb.net/evolution/none';
  const waitForSelector = '#main';
  const { browser, page } = await getBrowserAndPage(url, waitForSelector);

  const crawlingData = await page.$$eval('#main > .infocard-list-pkmn-lg', (el: Element[]) => {
    return el.reduce<IEvolutionChain[]>((acc, $infoCardList) => {
      const pokemons = Array.from($infoCardList.children).map($infoCard => {
        const name = $infoCard.querySelector('.ent-name')!.textContent!.replace(/\s/g, '');
        const image = `https://img.pokemondb.net/sprites/sword-shield/icon/${name.toLowerCase()}.png`;
        return { name, image, differentForm: null, evolvingTo: [] };
      });
      return [...acc, ...pokemons];
    }, []);
  });

  await browser.close();

  return crawlingData;
};

export const getEvolutionChains = async (type: string): Promise<IEvolutionChain[]> => {
  switch (type) {
    case EvolutionType.NONE:
      return withoutEvolutionCrawling();
    default:
      return evolutionCrawling(type);
  }
};
