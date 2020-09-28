import { IEvolvingTo, IPokemon } from '../pokemon.interface';
import { DIFFERENT_FORM, EVOLUTION_TYPE, EXCEPTIONAL_FORM_KEY } from '../pokemon.type';
import { PokemonCondition } from './pokemonCondition';

export class PokemonForm extends PokemonCondition {
  constructor(evolutionType: EVOLUTION_TYPE) {
    super(evolutionType);
  }

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
      case EXCEPTIONAL_FORM_KEY.FIFTY_PERCENT:
        return /50% forme/;
      case EXCEPTIONAL_FORM_KEY.TEN_PERCENT:
        return /10% forme/;
      case EXCEPTIONAL_FORM_KEY.PA_U_STYLE:
        return /pa'u style/;
      case EXCEPTIONAL_FORM_KEY.POM_POM_STYLE:
        return /pom-pom style/;
      case EXCEPTIONAL_FORM_KEY.HUNGRY_MODE:
        return /hangry mode|hungry mode/;
      default:
        return new RegExp(key.replace(/_/, ''));
    }
  };

  private getForm = (form: string | null): string | null => {
    if (!form) return null;

    const hasForm = (regExp: string | RegExp): boolean => new RegExp(regExp, 'i').test(form);
    if (hasForm(/striped|male|female|own tempo rockruff/)) return null;

    const key = Object.keys(DIFFERENT_FORM).find(key => hasForm(this.convertKeyToRegExp(key)));
    return key ? DIFFERENT_FORM[key as keyof typeof DIFFERENT_FORM] : null;
  };

  private deepConvertForm = (chain: IPokemon): IPokemon | IEvolvingTo => {
    return {
      ...chain,
      form: this.getForm(chain.form),
      differentForm: chain.differentForm.map(this.deepConvertForm),
      evolvingTo: chain.evolvingTo.map(to => this.deepConvertForm(this.convertConditionIntoKor(to)) as IEvolvingTo),
    };
  };

  public convertFormIntoKor = (chain: IPokemon): IPokemon => {
    return this.deepConvertForm(chain);
  };
}
