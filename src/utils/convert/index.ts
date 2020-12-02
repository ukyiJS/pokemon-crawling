import { AbilityNames } from '@/pokemon/enums/abilityName.enum';
import {
  AdditionalConditionNames,
  Conditions,
  LevelAdditionalConditionNames,
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
  private replaceFormName = (name: string): string => {
    return name.replace(/(mega).*x$|(mega).*y$|^(mega).*|^(primal).*|^(alola)n.*|^(galar)ian.*/gi, (str, ...$$) => {
      if (/^galarian.*(?:mode)/.test(str)) return str;
      const index = $$.findIndex(str => str);
      const matchText = $$[index];
      switch (index) {
        case 0:
          return `${matchText}X`;
        case 1:
          return `${matchText}Y`;
        case 2:
        case 3:
        case 4:
        case 5:
          return matchText;
        default:
          return str;
      }
    });
  };
  private convertToKorName = <T extends ObjectLiteral<string>>(
    enums: T,
    nameToConvert: string | string[],
    isReplace?: boolean,
  ): string | string[] => {
    const removeSpecialSymbol = (text: string) => {
      return (isReplace ? this.replaceFormName(text) : text).replace(/[^a-z0-9]/gi, '');
    };
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
    isReplace?: boolean,
  ): EvolvingToType[] | undefined => {
    const convertToKorName = this.convertToKorName.bind(null, enums);
    const convertToKorNameByEvolvingTo = this.convertToKorNameByEvolvingTo.bind(null, enums, key);
    const convert = (to: EvolvingToType) => {
      const name = to[key];
      return { ...to, [key]: name && convertToKorName(name, isReplace) };
    };

    const result = <EvolvingToType[]>evolvingTo?.map(convert);
    if (!result?.length) return undefined;

    return result.map(to => ({ ...to, evolvingTo: convertToKorNameByEvolvingTo(to.evolvingTo, isReplace) }));
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
}
