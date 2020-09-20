import { NODE_ENV } from '@/env';
import { writeJson } from '@/utils';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WriteJsonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [req] = context.getArgs();
    const [, , path] = req.route.path.split('/');
    return next.handle().pipe(
      map(data => {
        if (NODE_ENV !== 'development') return data;

        writeJson({ data, fileName: path, dirName: 'src/assets/json' });
        return data;
      }),
    );
  }
}
