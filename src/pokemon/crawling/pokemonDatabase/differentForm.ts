import { IPokemon } from '@/pokemon/pokemon.interface';
import { DIFFERENT_FORM, EVOLUTION_TYPE, EXCEPTIONAL_FORM_KEY } from '@/pokemon/pokemon.type';
import { EvolutionCondition } from './evolutionCondition';

export class DifferentForm {
  evolutionType?: EVOLUTION_TYPE;

  private convertKeyToRegExp = (key: string): RegExp => {
    switch (key) {
      case EXCEPTIONAL_FORM_KEY.MEGA_X:
        return /mega.*x$/;
      case EXCEPTIONAL_FORM_KEY.MEGA_Y:
        return /mega.*y$/;
      case EXCEPTIONAL_FORM_KEY.GALARIAN_STANDARD_MODE:
        return /galar.*standard mode/;
      case EXCEPTIONAL_FORM_KEY.GALARIAN_ZEN_MODE:
        return /galar.*zen mode/;
      case EXCEPTIONAL_FORM_KEY.ASH_GRENINJA:
        return /ash-greninja/;
      case EXCEPTIONAL_FORM_KEY.FIFTY_PERCENT_FORM:
        return /50% forme/;
      case EXCEPTIONAL_FORM_KEY.TEN_PERCENT_FORM:
        return /10% forme/;
      case EXCEPTIONAL_FORM_KEY.PA_U_STYLE:
        return /pa'u style/;
      case EXCEPTIONAL_FORM_KEY.POM_POM_STYLE:
        return /pom-pom style/;
      case EXCEPTIONAL_FORM_KEY.HUNGRY_MODE:
        return /hangry mode|hungry mode/;
      default:
        return new RegExp(key.replace(/_/g, ' '));
    }
  };

  private getForm = (form: string | null): string | null => {
    if (!form) return null;

    const hasForm = (regExp: string | RegExp): boolean => new RegExp(regExp, 'i').test(form);
    if (hasForm(/striped|male|female|own tempo rockruff/)) return null;

    const key = Object.keys(DIFFERENT_FORM).find(key => hasForm(this.convertKeyToRegExp(key)));
    return key ? DIFFERENT_FORM[key as keyof typeof DIFFERENT_FORM] : null;
  };

  private deepConvertForm = <T extends IPokemon>(chain: T): T => ({
    ...chain,
    form: this.getForm(chain.form),
    differentForm: chain.differentForm.map(this.deepConvertForm),
    evolvingTo: chain.evolvingTo.map(to => {
      const { convertConditionIntoKor } = new EvolutionCondition();
      const evolvingTo = this.evolutionType ? convertConditionIntoKor(to, this.evolutionType) : to;
      return this.deepConvertForm(evolvingTo);
    }),
  });

  public convertFormIntoKor = (chain: IPokemon, evolutionType?: EVOLUTION_TYPE): IPokemon => {
    this.evolutionType = evolutionType;
    return this.deepConvertForm(chain);
  };
}
