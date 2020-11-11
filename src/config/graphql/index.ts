import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  public async createGqlOptions(): Promise<GqlModuleOptions> {
    return {
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: true,
      playground: true,
      tracing: true,
      introspection: true,
      formatError: (error: GraphQLError): GraphQLFormattedError & ObjectLiteral => ({
        message: error.message,
        code: error.extensions?.code,
        locations: error.locations,
        path: error.path,
      }),
    };
  }
}
