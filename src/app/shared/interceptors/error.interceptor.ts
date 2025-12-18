import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorResponse } from '../models/errors';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let mappedError: ErrorResponse;

            if (error.error && typeof error.error === 'object') {
                mappedError = {
                    message: error.error.message ?? 'Error desconocido',
                    timestamp: new Date(error.error.timestamp),
                };
            } else {
                mappedError = {
                    message: error.message,
                    timestamp: new Date(),
                };
            }

            return throwError(() => mappedError);
        })
    );
};
