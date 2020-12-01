import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<number, Date> {
  public description = 'Date custom scalar type';

  public parseValue(value: number): Date {
    return new Date(value); // value from the client
  }

  public serialize(value: Date): number {
    return value.getTime(); // value sent to the client
  }

  public parseLiteral(ast: ValueNode): Date | null {
    if (ast.kind === Kind.INT) return new Date(ast.value);
    return null;
  }
}
