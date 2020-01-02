import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: import('@angular/common/http').HttpRequest<any>,
            next: import('@angular/common/http').HttpHandler): import('rxjs')
   .Observable<import('@angular/common/http').HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          return throwError(error.statusText);
        }
        if (error instanceof HttpErrorResponse) {
          const ApplicationError = error.headers.get('Application-Error');
          if (ApplicationError) {
           return throwError(ApplicationError);
          }
          const ServerError = error.error;
          let ModelStateErrors = '';
          if (ServerError.errors && typeof ServerError.errors === 'object') {
            for (const key in ServerError.errors) {
              if (ServerError.errors[key]) {
                 ModelStateErrors += ServerError.errors[key] + '\n';
              }
            }
          }
          return throwError(ModelStateErrors || ServerError || 'Server Error');
        }
      })
    );
  }
}

export const ErrorInterceptorProvidor = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
