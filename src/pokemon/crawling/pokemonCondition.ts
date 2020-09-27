import { AdditionalCondition, ElementalStone, EvolutionType, LevelCondition, TradingCondition } from '../pokemon.enum';
import { IEvolvingTo } from '../pokemon.interface';

type Condition = typeof LevelCondition | typeof ElementalStone | typeof TradingCondition | typeof AdditionalCondition;

export class PokemonCondition {
  evolutionType: EvolutionType;

  constructor(evolutionType: EvolutionType) {
    this.evolutionType = evolutionType;
  }

  private getConditionEnum = (type: EvolutionType): Condition => {
    switch (type) {
      case EvolutionType.LEVEL:
        return LevelCondition;
      case EvolutionType.STONE:
        return ElementalStone;
      default:
        return TradingCondition;
    }
  };

  private getCondition = (condition: string | null, ConditionEnum: Condition): string | null => {
    if (!condition) return null;

    const hasForm = (regExp: string | RegExp): boolean => new RegExp(regExp, 'i').test(condition);
    const key = Object.keys(ConditionEnum).find(key => hasForm(key.replace(/_/, '')));
    return key ? ConditionEnum[key as keyof typeof ConditionEnum] : null;
  };

  private convertCondition = (conditions: string | null, type: EvolutionType): string | null => {
    if (!conditions) return null;

    const [c1, c2] = conditions.split(',');
    const additionalCondition = this.getCondition(c2, AdditionalCondition) ?? '';

    const convertedCondition = this.getCondition(c1, this.getConditionEnum(type));
    return additionalCondition ? `${convertedCondition}, ${additionalCondition}` : convertedCondition;
  };

  private deepConvertCondition = (to: IEvolvingTo): IEvolvingTo => ({
    ...to,
    condition: this.convertCondition(to.condition, this.evolutionType),
    evolvingTo: to.evolvingTo.map(this.deepConvertCondition),
  });

  public convertConditionIntoKor = (to: IEvolvingTo): IEvolvingTo => this.deepConvertCondition(to);
}
