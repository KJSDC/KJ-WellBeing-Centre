import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class SpinnerInterceptorService implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show(undefined, {
      type: 'ball-pulse',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff'
    });
    return next.handle(req).pipe(
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}