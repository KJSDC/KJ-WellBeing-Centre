import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpinnerResolverService implements Resolve<boolean> {
  constructor(private spinner: NgxSpinnerService) {}

  resolve(): Observable<boolean> {
    this.spinner.show(undefined, {
      type: 'ball-pulse',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff'
    });
    return of(true).pipe(
      delay(1000), // Simulating some delay, adjust as needed
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}