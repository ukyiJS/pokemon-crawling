import { IEvolution, IEvolvingTo } from '@/pokemon/pokemon.interface';

export class EvolutionUtil {
  private twiceEvolution: IEvolution;
  private previousTwiceEvolution: IEvolution;

  public addTwiceEvolution = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
    this.twiceEvolution = evolution;
    const { no, evolvingTo, name, form } = evolution;

    const hasEvolvingTo = <T extends IEvolution>(pokemon: T): boolean => {
      return pokemon.evolvingTo.some(pokemon => pokemon.no === no);
    };

    const differentFormIndex = previousPokemons.findIndex(p => p.differentForm.some(hasEvolvingTo));
    const evolutionIndex = previousPokemons.findIndex(hasEvolvingTo);
    const middleEvolutionIndex = previousPokemons.findIndex(p => evolvingTo.some(to => to.no === p.no));

    const index = [differentFormIndex, evolutionIndex, middleEvolutionIndex].find(i => i > -1) ?? -1;
    if (index === -1) return false;

    this.previousTwiceEvolution = previousPokemons[index];

    if (differentFormIndex > -1) this.addTwiceEvolutionOfDifferentForm();
    else if (evolutionIndex > -1) this.addTwiceEvolutionOfPokemon();
    else if (middleEvolutionIndex > -1) previousPokemons[index] = this.getTwiceEvolutionOfMiddlePokemon();

    return true;
  };
  private addTwiceEvolutionOfDifferentForm = (): void => {
    const previous = this.previousTwiceEvolution;
    const { differentForm } = this.twiceEvolution;

    const evolvingTo = previous.evolvingTo.map(to => ({ ...to, evolvingTo: differentForm.flatMap(f => f.evolvingTo) }));
    previous.differentForm = previous.differentForm.map(to => ({ ...to, evolvingTo }));
  };
  private addTwiceEvolutionOfPokemon = (): void => {
    const previous = this.previousTwiceEvolution;
    previous.evolvingTo = previous.evolvingTo.map(to => ({ ...to, ...this.twiceEvolution }));
  };
  private getTwiceEvolutionOfMiddlePokemon = (): IEvolution => {
    const previous = this.previousTwiceEvolution;
    const isForm = previous.form;
    const { evolvingTo: twiceEvolvingTo } = this.twiceEvolution;

    let evolvingTo: IEvolvingTo[];
    if (isForm) evolvingTo = twiceEvolvingTo.map(to => ({ ...to, differentForm: [...to.differentForm, previous] }));
    else evolvingTo = twiceEvolvingTo.map(to => ({ ...to, ...previous }));

    return { ...this.twiceEvolution, evolvingTo };
  };
  public addMoreThanTwoKindsEvolution = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
    const { no, evolvingTo } = evolution;

    const index = previousPokemons.findIndex(e => e.no === no);

    if (index === -1) return false;

    const previousPokemon = previousPokemons[index];
    previousPokemon.evolvingTo = [...previousPokemon.evolvingTo, ...evolvingTo];

    return true;
  };
  public addDifferentForm = (previousPokemons: IEvolution[], evolution: IEvolution): boolean => {
    const { no, form } = evolution;

    if (!form) return false;

    const index = previousPokemons.findIndex(p => p.no === no);

    if (index === -1) return false;

    const previousPokemon = previousPokemons[index];
    previousPokemon.differentForm = [...previousPokemon.differentForm, evolution];

    return true;
  };
}
