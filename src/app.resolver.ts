import { Context, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  public getHello(@Context('req') req: any): string {
    return 'hello world!';
  }
}
