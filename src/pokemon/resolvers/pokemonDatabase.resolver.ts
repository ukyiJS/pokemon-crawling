import { getJson } from '@/utils';
import { Mutation, Resolver } from '@nestjs/graphql';
import { FindAndModifyWriteOpResultObject } from 'typeorm';
import { IPokemonDatabase } from '../interfaces/pokemonDatabase.interface';
import { PokemonDatabase } from '../model/pokemonDatabase.entity';
import { PokemonService } from '../pokemon.service';

@Resolver(() => PokemonDatabase)
export class PokemonDatabaseResolver {
  pokemons: PokemonDatabase[] | null;

  constructor(private readonly pokemonService: PokemonService) {
    this.pokemons = getJson<IPokemonDatabase[]>({ fileName: 'pokemonDatabase.json' });
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async addPokemonOfDatabase(): Promise<PokemonDatabase[] | null> {
    return this.pokemonService.addPokemonDatabase(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updateImageOfPokemonDatabase(): Promise<FindAndModifyWriteOpResultObject[] | null> {
    return this.pokemonService.updateImageOfPokemonDatabase(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updateIconImageOfPokemonDatabase(): Promise<FindAndModifyWriteOpResultObject[] | null> {
    return this.pokemonService.updateIconImageOfPokemonDatabase(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updatePokemonName(): Promise<PokemonDatabase[] | null> {
    return this.pokemonService.updatePokemonName(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updatePokemonTypes(): Promise<PokemonDatabase[] | null> {
    return this.pokemonService.updatePokemonTypes(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updatePokemonSpecies(): Promise<PokemonDatabase[] | null> {
    return this.pokemonService.updatePokemonSpecies(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updatePokemonAbilities(): Promise<PokemonDatabase[] | null> {
    return this.pokemonService.updatePokemonAbilities(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updatePokemonEggGroups(): Promise<PokemonDatabase[] | null> {
    if (!this.pokemons) return [];
    return this.pokemonService.updatePokemonEggGroups(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase])
  public async updatePokemonForm(): Promise<PokemonDatabase[]> {
    if (!this.pokemons) return [];
    return this.pokemonService.updatePokemonForm(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase])
  public async updatePokemonEvolutionCondition(): Promise<PokemonDatabase[]> {
    if (!this.pokemons) return [];
    return this.pokemonService.updatePokemonEvolutionCondition(this.pokemons);
  }
}
