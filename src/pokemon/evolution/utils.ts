import { IWindow } from '@/utils';
import { Page } from 'puppeteer';
import {
  AbilityConditionType,
  AreaConditionType,
  AreaType,
  StoneType,
  ConditionType,
  FormType,
  IEvolutionChain,
  IEvolutionTo,
  IPokemon,
  ItemConditionType,
  OtherConditionType,
  TradingConditionType,
  EvolutionType,
} from './types';

declare let window: IWindow;

export const evolutionUtil = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    window.getPokemons = (el: NodeListOf<Element>) => {
      return Array.from(el).map($td => {
        const name = $td.querySelector('.ent-name')!.textContent!;
        const image = $td.querySelector('.icon-pkmn')!.getAttribute('data-src')!;
        const differentForm = $td.querySelector('.text-muted')?.textContent ?? null;

        return { name, image, differentForm };
      });
    };
    window.addEvolutionFrom = (acc: IEvolutionChain[], from: IPokemon, to: IEvolutionTo): IEvolutionChain[] => {
      const fromIndex = acc.findIndex(p => p.name === from.name);
      acc[fromIndex].evolutionTo.push(to);
      return acc;
    };
  });
};

export const hasText = (text: string) => (regExpString: string): boolean => new RegExp(regExpString, 'gi').test(text);

export const getDifferentForm = (differentForm: string | null): string | null => {
  if (!differentForm) return null;

  const ExclusionForm = /Male|Rockruff|Shield/.test(differentForm);
  if (ExclusionForm) return null;

  const hasDifferentForm = hasText(differentForm);

  if (hasDifferentForm('Galarian Standard')) return FormType.ALOLA_DARMANITAN_STANDARD;
  if (hasDifferentForm('Alola')) return FormType.ALOLA;
  if (hasDifferentForm('Galar')) return FormType.GALAR;
  if (hasDifferentForm('Plant')) return FormType.WORMADAM_GRASS;
  if (hasDifferentForm('Sandy')) return FormType.WORMADAM_CAVES;
  if (hasDifferentForm('Trash')) return FormType.WORMADAM_BUILDINGS;
  if (hasDifferentForm('Low')) return FormType.TOXTRICITY_LOW;
  if (hasDifferentForm('Amped')) return FormType.TOXTRICITY_HIGH;
  if (hasDifferentForm('Standard')) return FormType.DARMANITAN_STANDARD;
  if (hasDifferentForm('Midday')) return FormType.ROCKRUFF_MID_DAY;
  if (hasDifferentForm('Midnight')) return FormType.ROCKRUFF_MID_NIGHT;
  if (hasDifferentForm('Dusk')) return FormType.ROCKRUFF_DUSK;
  if (hasDifferentForm('Single')) return FormType.URSHIFU_SINGLE;
  if (hasDifferentForm('Rapid')) return FormType.URSHIFU_RAPID;
  return null;
};

export const getCondition = (condition: string): string => {
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
  /* trading */
  if (hasCondition('Kings Rock')) return AreaConditionType.ALOLA;
  if (hasCondition('Galar')) return AreaConditionType.GALAR;
  if (hasCondition('Male')) return ConditionType.MALE;
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
  /* otherCondition */
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

export const getArea = (area: string): string => {
  const hasArea = hasText(area);
  if (!area) return '';

  if (hasArea('Alola')) return `${AreaType.ALOLA}에서`;
  if (hasArea('galar')) return `${AreaType.GALAR}에서`;
  if (hasArea('grass')) return `${AreaType.GRASS}애서`;
  if (hasArea('caves')) return `${AreaType.CAVES}애서`;
  if (hasArea('buildings')) return `${AreaType.BUILDINGS}애서`;
  if (hasArea('Sun or Ultra Sun')) return `${AreaType.SUN_OR_ULTRA_SUN}에서`;
  if (hasArea('Moon or Ultra Moon')) return `${AreaType.MOON_OR_ULTRA_MOON}에서`;
  if (hasArea('Ultra Sun/Moon')) return `${AreaType.ULTRA_SUN_OR_ULTRA_MOON}에서`;
  if (hasArea('Pokéball in bag')) return `가방에 ${AreaType.POKEBALL}을 가지고 있고`;
  return area;
};

export const getStone = (stone: string): string => {
  const key = Object.keys(StoneType).find(key => new RegExp(key, 'gi').test(stone)) as keyof typeof StoneType;
  return StoneType[key];
};

const differentForm = (data: IEvolutionChain) => {
  data.differentForm = getDifferentForm(data.differentForm);
  return data;
};

const levelCondition = (to: IEvolutionTo) => {
  differentForm(to as IEvolutionChain & IEvolutionTo);
  const [level, conditions] = to.condition;
  const filteredCondition = conditions
    .split(',')
    .reverse()
    .reduce((acc: string, text: string, i: number) => `${acc},${i > 0 ? getCondition(text) : getArea(text)}`, '');
  to.condition = [level, filteredCondition].filter(c => c);
};

export const convertEngToKor = (type: string, crawlingData: IEvolutionChain[]): IEvolutionChain[] => {
  return crawlingData.map(data => {
    differentForm(data).evolutionTo.forEach(to => {
      switch (type) {
        case EvolutionType.LEVEL:
          return levelCondition(to);
        default:
          return null;
      }
    });
    return data;
  });
};
