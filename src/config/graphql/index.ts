import { IS_OFFLINE, IS_PRODUCTION } from '@/env';
import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  async createGqlOptions(): Promise<GqlModuleOptions> {
    return {
      autoSchemaFile: (!IS_PRODUCTION || IS_OFFLINE) && join(process.cwd(), 'src/schema.gql'),
      typePaths: IS_PRODUCTION ? ['dist/*.gql'] : undefined,
      cors: true,
      playground: true,
      tracing: !IS_PRODUCTION,
      introspection: true,
      cacheControl: IS_PRODUCTION && {
        defaultMaxAge: 5,
        stripFormattedExtensions: false,
        calculateHttpHeaders: false,
      },
      formatError: (error: GraphQLError): GraphQLFormattedError & ObjectLiteral => ({
        message: error.message,
        code: error.extensions?.code,
        locations: error.locations,
        path: error.path,
      }),
    };
  }
}
