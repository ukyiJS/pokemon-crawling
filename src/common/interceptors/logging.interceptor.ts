import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [req, , , gql] = context.getArgs();

    const type = gql ? gql.parentType : req.route.stack[0].method;
    const field = gql ? gql.fieldName : req.route.path;

    const logContext = gql ? 'GraphQL' : 'Router';
    const logMessage = `${type} » ${field}`;

    return next.handle().pipe(tap(() => Logger.verbose(logMessage, logContext)));
  }
}
