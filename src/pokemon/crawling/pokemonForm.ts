import { DifferentForm, EvolutionType, ExceptionalFormKey } from '../pokemon.enum';
import { IEvolutionChain, IEvolvingTo } from '../pokemon.interface';
import { PokemonCondition } from './pokemonCondition';

export class PokemonForm extends PokemonCondition {
  constructor(evolutionType: EvolutionType) {
    super(evolutionType);
  }

  private convertKeyToRegExp = (key: string): RegExp => {
    switch (key) {
      case ExceptionalFormKey.MEGA_X:
        return /mega.*x$/;
      case ExceptionalFormKey.MEGA_Y:
        return /mega.*y$/;
      case ExceptionalFormKey.GALARIAN_STANDARD_MODE:
        return /galar.*standard mode/;
      case ExceptionalFormKey.GALARIAN_ZEN_MODE:
        return /galar.*zen mode/;
      case ExceptionalFormKey.ASH_GRENINJA:
        return /ash-greninja/;
      case ExceptionalFormKey.FIFTY_PERCENT:
        return /50% forme/;
      case ExceptionalFormKey.TEN_PERCENT:
        return /10% forme/;
      case ExceptionalFormKey.PA_U_STYLE:
        return /pa'u style/;
      case ExceptionalFormKey.POM_POM_STYLE:
        return /pom-pom style/;
      case ExceptionalFormKey.HUNGRY_MODE:
        return /hangry mode|hungry mode/;
      default:
        return new RegExp(key.replace(/_/, ''));
    }
  };

  private getForm = (form: string | null): string | null => {
    if (!form) return null;

    const hasForm = (regExp: string | RegExp): boolean => new RegExp(regExp, 'i').test(form);
    if (hasForm(/striped|male|female|own tempo rockruff/)) return null;

    const key = Object.keys(DifferentForm).find(key => hasForm(this.convertKeyToRegExp(key)));
    return key ? DifferentForm[key as keyof typeof DifferentForm] : null;
  };

  private deepConvertForm = (chain: IEvolutionChain): IEvolutionChain | IEvolvingTo => {
    return {
      ...chain,
      form: this.getForm(chain.form),
      differentForm: chain.differentForm.map(this.deepConvertForm),
      evolvingTo: chain.evolvingTo.map(to => this.deepConvertForm(this.convertConditionIntoKor(to)) as IEvolvingTo),
    };
  };

  public convertFormIntoKor = (chain: IEvolutionChain): IEvolutionChain => {
    return this.deepConvertForm(chain);
  };
}
