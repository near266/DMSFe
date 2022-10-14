import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import {
    BehaviorSubject,
    catchError,
    filter,
    Observable,
    switchMap,
    take,
    throwError,
  } from 'rxjs';

  @Injectable()
  export class SecretInterceptor implements HttpInterceptor {
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      if (request.url.includes('https://provinces.open-api.vn/api/')) {
        return next.handle(request);
      }
      const token = localStorage.getItem('access_token');
      if(token) {
        const AuthRequest = request.clone({setHeaders: {
            'Authorization': `Bearer ${token}`,
          }});
          return next.handle(AuthRequest);
      } else {
        return next.handle(request)
      }
    }
  }
