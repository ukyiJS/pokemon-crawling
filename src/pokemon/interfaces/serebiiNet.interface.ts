import { Field, InterfaceType } from '@nestjs/graphql';
import { SerebiiNetType } from '../types/serebiiNet.type';

@InterfaceType()
export abstract class ISerebiiNet extends SerebiiNetType {
  @Field(() => [SerebiiNetType])
  public differentForm?: SerebiiNetType[];
}
