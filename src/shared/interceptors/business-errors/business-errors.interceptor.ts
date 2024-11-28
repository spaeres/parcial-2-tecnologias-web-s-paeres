import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BusinessError } from '../../errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.type === BusinessError.NOT_FOUND)
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        else if (error.type === BusinessError.PRECONDITION_FAILED)
          throw new HttpException(
            error.message,
            HttpStatus.PRECONDITION_FAILED,
          );
        else if (error.type === BusinessError.BAD_REQUEST)
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        else throw error;
      }),
    );
  }
}
