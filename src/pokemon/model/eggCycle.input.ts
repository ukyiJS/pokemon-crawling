import { Field, InputType, Int } from '@nestjs/graphql';
import { IEggCycle } from '../pokemon.interface';

@InputType()
export class EggCycleInput implements IEggCycle {
  @Field(() => Int)
  cycle: number;

  @Field({ nullable: true })
  step: string;
}
