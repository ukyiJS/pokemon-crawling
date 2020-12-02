import { getJson } from '@/utils';
import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
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
    const pokemons = await this.pokemonService.addPokemonDatabase(this.pokemons);
    this.pokemons = pokemons;

    return pokemons;
  }

  @ResolveField(() => String)
  public async image(@Parent() pokemon: PokemonDatabase): Promise<string> {
    const [{ image }] = (await this.pokemonService.updateImageOfPokemonDatabase([pokemon]))!;
    return image;
  }

  @ResolveField(() => String)
  public async icon(@Parent() pokemon: PokemonDatabase): Promise<string> {
    const [{ icon }] = (await this.pokemonService.updateIconImageOfPokemonDatabase([pokemon]))!;
    return <string>icon;
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updateImageOfPokemonDatabase(): Promise<PokemonDatabase[] | null> {
    return this.pokemonService.updateImageOfPokemonDatabase(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updateIconImageOfPokemonDatabase(): Promise<PokemonDatabase[] | null> {
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

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updatePokemonForm(): Promise<PokemonDatabase[] | null> {
    if (!this.pokemons) return [];
    return this.pokemonService.updatePokemonForm(this.pokemons);
  }

  @Mutation(() => [PokemonDatabase], { nullable: true })
  public async updatePokemonEvolutionCondition(): Promise<PokemonDatabase[] | null> {
    return this.pokemonService.updatePokemonEvolutionCondition(this.pokemons);
  }
}
