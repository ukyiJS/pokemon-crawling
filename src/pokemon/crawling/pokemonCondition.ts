import { IEvolvingTo } from '../pokemon.interface';
import {
  ADDITIONAL_CONDITION,
  ELEMENTAL_STONE,
  EVOLUTION_TYPE,
  FRIENDSHIP,
  LEVEL_CONDITION,
  OTHER_CONDITION,
  TRADING_CONDITION,
} from '../pokemon.type';

export class PokemonCondition {
  evolutionType?: EVOLUTION_TYPE;

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
          return OTHER_CONDITION;
      }
    })();

    const key = Object.keys(CONDITION).find(key => hasForm(key.replace(/_/g, ' ')));
    const convertedCondition = CONDITION[key as keyof typeof CONDITION] ?? null;

    return convertedCondition;
  };

  private convertCondition = (conditions: string | null): string | null => {
    if (!conditions || this.evolutionType) return null;

    const [c1, c2] = conditions.split(',');
    const additionalCondition = this.getCondition(c2)?.concat(', ') ?? '';
    const convertedCondition = this.getCondition(c1, this.evolutionType);

    if (this.evolutionType === EVOLUTION_TYPE.FRIENDSHIP)
      return `${convertedCondition?.concat(' ') ?? ''}${FRIENDSHIP.NONE} 레벨업`;

    return additionalCondition ? `${additionalCondition}${convertedCondition}` : convertedCondition;
  };

  private deepConvertCondition = (to: IEvolvingTo): IEvolvingTo => {
    return {
      ...to,
      condition: this.convertCondition(to.condition),
      evolvingTo: to.evolvingTo.map(this.deepConvertCondition),
    };
  };

  public convertConditionIntoKor = (to: IEvolvingTo, evolutionType: EVOLUTION_TYPE): IEvolvingTo => {
    this.evolutionType = evolutionType;
    return this.deepConvertCondition(to);
  };
}
