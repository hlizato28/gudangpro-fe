import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { LoadingService } from './../services/loading.service'

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true);
    return next.handle(request).pipe(
      catchError((error) => {
        console.error('HTTP request error:', error);
        this.loadingService.setLoading(false);
        return throwError(error);
      }),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    );
  }
}
