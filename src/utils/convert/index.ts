import { AbilityNames } from '@/pokemon/enums/abilityName.enum';
import {
  AdditionalConditionNames,
  Conditions,
  FriendshipAdditionalConditionNames,
  LevelAdditionalConditionNames,
  OtherConditionNames,
  TradeConditionNames,
  UseItemConditionNames,
} from '@/pokemon/enums/conditionName.enum';
import { ConditionType, ConditionTypes } from '@/pokemon/enums/conditionType.enum';
import { EggGroupNames } from '@/pokemon/enums/eggGroupName.enum';
import { FormNames } from '@/pokemon/enums/formName.enum';
import { PokemonNames } from '@/pokemon/enums/pokemonName.enum';
import { TypeNames } from '@/pokemon/enums/pokemonType.enum';
import { SpeciesNames } from '@/pokemon/enums/speciesName.enum';
import { PokemonDatabase } from '@/pokemon/model/pokemonDatabase.entity';
import { ObjectLiteral } from '@/pokemon/pokemon.interface';
import { EvolvingToType } from '@/pokemon/types/evolvingTo.type';
import { Logger } from '@nestjs/common';

export class Convert {
  private replaceText = (text: string) => text.replace(/[^a-z0-9=><,]/gi, '');
  private equals = (value1: string, value2: string): boolean => {
    return new RegExp(`${this.replaceText(value1)}$`, 'gi').test(this.replaceText(value2));
  };
  private convertToKorName = <T extends ObjectLiteral<string>>(
    enums: T,
    nameToConvert: string | string[],
  ): string | string[] => {
    const removeSpecialSymbol = (text: string) => text.replace(/[^a-z0-9]/gi, '');
    const findKorName = (name: string): string => {
      const [, result] = Object.entries(enums).find(([key]) => {
        return RegExp(`${removeSpecialSymbol(key)}$`, 'gi').test(removeSpecialSymbol(name));
      })!;
      return result;
    };

    try {
      if (Array.isArray(nameToConvert)) return nameToConvert.map(findKorName);
      return findKorName(nameToConvert);
    } catch (error) {
      Logger.error(`No matching ${nameToConvert} found`, '', 'NoMatchingError');
      throw error;
    }
  };
  private convertToKorNameByEvolvingTo = <T extends ObjectLiteral<string>>(
    enums: T,
    key: keyof Omit<EvolvingToType, 'evolvingTo'>,
    evolvingTo: EvolvingToType[] = [],
  ): EvolvingToType[] | undefined => {
    const convertToKorName = this.convertToKorName.bind(null, enums);
    const convertToKorNameByEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, enums, key);
    const convert = (to: EvolvingToType) => {
      const name = to[key];
      return { ...to, [key]: name && convertToKorName(name) };
    };

    const result = <EvolvingToType[]>evolvingTo?.map(convert);
    if (!result?.length) return undefined;

    return result.map(to => ({ ...to, evolvingTo: convertToKorNameByEvolvingTo(to.evolvingTo) }));
  };
  public convertPokemonName = (pokemons: PokemonDatabase[]): PokemonDatabase[] => {
    const convertToKorName = (name: string): string => <string>this.convertToKorName(PokemonNames, name);
    const convertToNameOfEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, PokemonNames, 'name');
    const convert = ({ name, ...pokemon }: PokemonDatabase): PokemonDatabase => ({
      ...pokemon,
      name: convertToKorName(name),
    });

    return pokemons.map(({ evolvingTo, differentForm, ...pokemon }) => ({
      ...convert(pokemon),
      evolvingTo: convertToNameOfEvolvingTo(evolvingTo),
      differentForm: differentForm?.map(convert),
    }));
  };
  public convertPokemonTypes = (pokemons: PokemonDatabase[]): PokemonDatabase[] => {
    const convertToKorName = (name: string): string => <string>this.convertToKorName(TypeNames, name);
    const convertToKorNameByEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, TypeNames, 'types');
    const convert = ({ types, ...pokemon }: PokemonDatabase): PokemonDatabase => ({
      ...pokemon,
      types: types.map(type => convertToKorName(type)),
    });

    return pokemons.map(({ evolvingTo, differentForm, ...pokemon }) => ({
      ...convert(pokemon),
      evolvingTo: convertToKorNameByEvolvingTo(evolvingTo),
      differentForm: differentForm?.map(convert),
    }));
  };
  public convertPokemonSpecies = (pokemons: PokemonDatabase[]): PokemonDatabase[] => {
    const convertToKorName = (name: string): string => <string>this.convertToKorName(SpeciesNames, name);
    const convert = ({ species, ...pokemon }: PokemonDatabase): PokemonDatabase => ({
      ...pokemon,
      species: convertToKorName(species),
    });

    return pokemons.map(({ species, differentForm, ...pokemon }) => ({
      ...pokemon,
      species: convertToKorName(species),
      differentForm: differentForm?.map(convert),
    }));
  };
  public convertPokemonAbilities = (pokemons: PokemonDatabase[]): PokemonDatabase[] => {
    const convertToKorName = (name: string): string => <string>this.convertToKorName(AbilityNames, name);
    const convert = ({ abilities, hiddenAbility, ...pokemon }: PokemonDatabase) => ({
      ...pokemon,
      abilities: abilities.map(ability => ability && convertToKorName(ability)),
      hiddenAbility: hiddenAbility && convertToKorName(hiddenAbility),
    });

    return pokemons.map(({ differentForm, ...pokemon }) => ({
      ...convert(pokemon),
      differentForm: differentForm?.map(convert),
    }));
  };
  public convertPokemonEggGroups = (pokemons: PokemonDatabase[]): PokemonDatabase[] => {
    const convertToKorName = (name: string): string => <string>this.convertToKorName(EggGroupNames, name);

    return pokemons.map(({ eegGroups, ...pokemon }) => ({ ...pokemon, eegGroups: eegGroups.map(convertToKorName) }));
  };
  public convertPokemonForm = (pokemons: PokemonDatabase[]): PokemonDatabase[] => {
    const convertToKorNameByEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, FormNames, 'form');
    const convert = ({ form, ...pokemon }: PokemonDatabase): PokemonDatabase => ({
      ...pokemon,
      form: form && <string>this.convertToKorName(FormNames, form),
    });

    return pokemons.map(({ evolvingTo, differentForm, ...pokemon }) => ({
      ...convert(pokemon),
      evolvingTo: convertToKorNameByEvolvingTo(evolvingTo),
      differentForm: differentForm?.map(convert),
    }));
  };
  private mergeAdditionalCondition = (condition1?: string, condition2?: string): string => {
    const additionalCondition = (condition1 && condition1) || (condition2 && condition2.concat(` ${condition1}`));
    return additionalCondition ?? '';
  };
  private getAdditionalCondition = (condition: string | undefined): string | undefined => {
    if (!condition) return undefined;
    if (/^outside|knowingFairymove|inGen8|inUltraSunMoon|400MeltanCandies/g) return undefined;

    let result;
    try {
      const additionalConditionNames = Object.entries(AdditionalConditionNames);
      [, result] = additionalConditionNames.find(([key]) => this.equals(key, condition))!;
    } catch (error) {
      Logger.error(`No matching ${condition} found`, '', 'NoMatchingError');
    }

    return result;
  };
  private getLevelCondition = (condition?: string): string[] | undefined => {
    if (!condition) return undefined;

    const levelAdditionalConditionNames = Object.entries(LevelAdditionalConditionNames);
    const [level, c1, c2] = <Conditions>this.replaceText(condition).split(/,/);
    const levelCondition = level.replace(/.*(?:\D)(.*)/g, '레벨 $1');

    const [, condition1] = levelAdditionalConditionNames.find(([key]) => c1 && this.equals(key, c1)) ?? [];
    const condition2 = this.getAdditionalCondition(c2);
    let additionalCondition = this.mergeAdditionalCondition(condition1, condition2) || null;
    if (additionalCondition !== '랜덤') additionalCondition = additionalCondition?.concat(' 레벨업') ?? '';

    return [levelCondition, additionalCondition].filter(c => c);
  };
  private getUseItemCondition = (condition?: string): string[] | undefined => {
    if (!condition) return undefined;

    const useItemConditionNames = Object.entries(UseItemConditionNames);
    const [c1, c2, c3] = <Conditions>this.replaceText(condition).split(/,/);

    const [, useItem] = useItemConditionNames.find(([key]) => this.equals(key, c1)) ?? [];
    const useItemCondition = `${useItem} 사용`;

    const condition1 = this.getAdditionalCondition(c2);
    const condition2 = this.getAdditionalCondition(c3);
    const additionalCondition = this.mergeAdditionalCondition(condition1, condition2);

    return [additionalCondition, useItemCondition].filter(c => c);
  };
  private getTradeCondition = (condition?: string): string[] | undefined => {
    if (!condition) return undefined;

    const tradeText = '통신교환';
    const tradeConditionNames = Object.entries(TradeConditionNames);
    const [c1, c2, c3] = <Conditions>this.replaceText(condition).split(/,/);
    const [, trade] = tradeConditionNames.find(([key]) => this.equals(key, c1)) ?? [];
    const tradeCondition = trade?.concat(` ${tradeText}`) ?? tradeText;

    const condition1 = this.getAdditionalCondition(c2);
    const condition2 = this.getAdditionalCondition(c3);
    const additionalCondition = this.mergeAdditionalCondition(condition1, condition2);

    return [additionalCondition, tradeCondition].filter(c => c);
  };
  private getFriendshipCondition = (condition?: string): string[] | undefined => {
    if (!condition) return undefined;

    const friendshipText = '친밀도가 220 이상일 때 레벨업';
    const friendshipConditionNames = Object.entries(FriendshipAdditionalConditionNames);
    const [, c2] = <Conditions>this.replaceText(condition).split(/,/);
    const [, additionalCondition] = friendshipConditionNames.find(([key]) => c2 && this.equals(key, c2)) ?? [];

    return [additionalCondition ?? '', friendshipText].filter(c => c);
  };
  private getOtherConditions = (condition?: string): string[] | undefined => {
    if (!condition) return undefined;

    const otherConditionNames = Object.entries(OtherConditionNames);
    const [c1, c2, c3] = <Conditions>this.replaceText(condition).split(/,/);
    const [, otherCondition] = otherConditionNames.find(([key]) => this.equals(key, c1)) ?? [];

    const condition1 = this.getAdditionalCondition(c2);
    const condition2 = this.getAdditionalCondition(c3);
    const additionalCondition = this.mergeAdditionalCondition(condition1, condition2);

    return [additionalCondition, otherCondition ?? ''].filter(c => c);
  };
  private getConditionType = (condition?: string): ConditionType | null => {
    if (!condition) return null;

    const match = <(keyof typeof ConditionTypes)[] | undefined>condition
      .toUpperCase()
      .match(/(level)|(use)|(trade)|(friendship)/i)
      ?.slice(1);
    if (!match) return ConditionTypes.OTHER;

    return ConditionTypes[match.find(m => m)!];
  };
  private convertCondition = ({ condition, ...evolvingTo }: EvolvingToType): EvolvingToType => {
    const conditionType = this.getConditionType(condition);
    if (!conditionType) return evolvingTo;

    switch (conditionType) {
      case ConditionTypes.LEVEL:
        return { ...evolvingTo, conditions: this.getLevelCondition(condition) };
      case ConditionTypes.USE:
        return { ...evolvingTo, conditions: this.getUseItemCondition(condition) };
      case ConditionTypes.TRADE:
        return { ...evolvingTo, conditions: this.getTradeCondition(condition) };
      case ConditionTypes.FRIENDSHIP:
        return { ...evolvingTo, conditions: this.getFriendshipCondition(condition) };
      default:
        return { ...evolvingTo, conditions: this.getOtherConditions(condition) };
    }
  };
  public convertPokemonEvolutionCondition(pokemons: PokemonDatabase[]): PokemonDatabase[] {
    const convertEvolvingTo = (evolvingTo?: EvolvingToType[]): EvolvingToType[] | undefined => {
      const result = evolvingTo?.map(({ evolvingTo, ...pokemon }) => ({
        ...pokemon,
        evolvingTo: evolvingTo?.map(this.convertCondition),
      }));

      if (!result?.length) return undefined;
      return result.map(({ evolvingTo, ...pokemon }) => ({ ...pokemon, evolvingTo: convertEvolvingTo(evolvingTo) }));
    };

    return pokemons.map(({ evolvingTo, ...pokemon }) => ({
      ...pokemon,
      evolvingTo: convertEvolvingTo(evolvingTo),
    }));
  }
}
