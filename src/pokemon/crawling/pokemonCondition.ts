import { IEvolvingTo } from '../pokemon.interface';
import {
  ADDITIONAL_CONDITION,
  ELEMENTAL_STONE,
  EVOLUTION_TYPE,
  FRIENDSHIP,
  LEVEL_CONDITION,
  TRADING_CONDITION,
} from '../pokemon.type';

export class PokemonCondition {
  evolutionType: EVOLUTION_TYPE;

  constructor(evolutionType: EVOLUTION_TYPE) {
    this.evolutionType = evolutionType;
  }

  private getCondition = (condition: string | null, type?: EVOLUTION_TYPE): string | null => {
    if (!condition) return null;

    const hasForm = (regExp: string | RegExp): boolean => new RegExp(regExp, 'i').test(condition);
    if (hasForm(/outside/)) return null;

    const CONDITION = (() => {
      if (!type) return ADDITIONAL_CONDITION;
      switch (type) {
        case EVOLUTION_TYPE.LEVEL:
          return LEVEL_CONDITION;
        case EVOLUTION_TYPE.STONE:
          return ELEMENTAL_STONE;
        case EVOLUTION_TYPE.FRIENDSHIP:
          return FRIENDSHIP;
        case EVOLUTION_TYPE.TRADE:
          return TRADING_CONDITION;
        default:
          return LEVEL_CONDITION;
      }
    })();

    const key = Object.keys(CONDITION).find(key => hasForm(key.replace(/_/, '')));
    const convertedCondition = CONDITION[key as keyof typeof CONDITION] ?? null;

    return convertedCondition;
  };

  private convertCondition = (conditions: string | null, type: EVOLUTION_TYPE): string | null => {
    if (!conditions) return null;

    const [c1, c2] = conditions.split(',');
    const additionalCondition = this.getCondition(c2)?.concat(', ') ?? '';
    const convertedCondition = this.getCondition(c1, type);

    if (type === EVOLUTION_TYPE.FRIENDSHIP) return `${convertedCondition?.concat(' ') ?? ''}${FRIENDSHIP.NONE} 레벨업`;

    return additionalCondition ? `${additionalCondition}${convertedCondition}` : convertedCondition;
  };

  private deepConvertCondition = (to: IEvolvingTo): IEvolvingTo => ({
    ...to,
    condition: this.convertCondition(to.condition, this.evolutionType),
    evolvingTo: to.evolvingTo.map(this.deepConvertCondition),
  });

  public convertConditionIntoKor = (to: IEvolvingTo): IEvolvingTo => this.deepConvertCondition(to);
}
