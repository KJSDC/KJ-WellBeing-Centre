import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.cookieService.get('authToken');
    if (authToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      });
      return next.handle(cloned).pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const headers = event.headers.keys();
            console.log("All headers:", headers); // Log all headers for debugging
            const newToken = event.headers.get('newtoken');
            // console.log("Interceptor new token from headers:", newToken);
            if (newToken) {
              // Store the new token
              this.cookieService.set('authToken', newToken, { path: '/' });
            }
          }
          // console.log("Interceptor response event:", event); 
        })
      );
    } else {
      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {
          // console.log("Interceptor response event:", event);
        })
      );
    }
  }
}
