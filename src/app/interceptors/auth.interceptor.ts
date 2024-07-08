import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private keyToken: string = "KEYTOKEN";
  private exemptUrls: string[] = ['/api/cabang']; // Sesuaikan dengan URL yang sebenarnya

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Periksa apakah URL saat ini ada dalam daftar pengecualian
    if (this.isUrlExempt(req.url)) {
      return next.handle(req);
    }

    const token = localStorage.getItem(this.keyToken);
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logout();
          }
          return throwError(error);
        })
      );
    } else {
      return next.handle(req);
    }
  }

  private isUrlExempt(url: string): boolean {
    return this.exemptUrls.some(exemptUrl => url.includes(exemptUrl));
  }

  private logout() {
    localStorage.removeItem(this.keyToken);
    this.router.navigate(['/login']);
  }
}

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   private keyToken: string = "KEYTOKEN";

//   constructor(private router: Router) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     if (req.headers.get('Skip-Interceptor') === 'true') {
//       // Hapus header 'Skip-Interceptor' sebelum mengirim request
//       const newHeaders = req.headers.delete('Skip-Interceptor');
//       const skippedReq = req.clone({ headers: newHeaders });
//       return next.handle(skippedReq);
//     }
    
//     const token = localStorage.getItem(this.keyToken);
//     if (token) {
//       const cloned = req.clone({
//         headers: req.headers.set('Authorization', `Bearer ${token}`)
//       });
//       return next.handle(cloned).pipe(
//         catchError((error: HttpErrorResponse) => {
//           if (error.status === 401) {
//             this.logout();
//           }
//           return throwError(() => error);
//         })
//       );
//     } else {
//       return next.handle(req);
//     }
//   }

//   private logout() {
//     localStorage.removeItem(this.keyToken);
//     this.router.navigate(['/login']);
//   }
// }
