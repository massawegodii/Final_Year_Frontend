import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertMessage$: Observable<string>;

  private alertTime: Date | null = null;

  constructor() {
    this.alertMessage$ = interval(1000).pipe(
      map(() => {
        if (this.alertTime && new Date() >= this.alertTime) {
          return 'SAMS';
        }
        return '';
      })
    );
  }

  setAlertTime(time: Date) {
    this.alertTime = time;
  }

  getAlertMessage(): Observable<string> {
    return this.alertMessage$;
  }
}
