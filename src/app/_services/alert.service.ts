import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, interval, map, switchMap } from 'rxjs';
import { Maintanance } from '../_model/maintanance_model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertMessage$: Observable<string>;

  constructor(private http: HttpClient) {
    this.alertMessage$ = interval(1000).pipe(
      switchMap(() => this.checkMaintenance()),
      map((maintanances: Maintanance[]) => {
        const currentDateTime = new Date();
        const darEsSalaamTime = new Date(
          currentDateTime.toLocaleString('en-US', {
            timeZone: 'Africa/Dar_es_Salaam',
          })
        );

        for (const maintenance of maintanances) {
          const maintenanceDateTime = new Date(
            `${maintenance.selectedDate}T${maintenance.selectedTime}`
          );
          if (this.isSameDateTime(darEsSalaamTime, maintenanceDateTime)) {
            return 'SAMS!';
          }
        }
        return '';
      })
    );
  }

  private checkMaintenance(): Observable<Maintanance[]> {
    return this.http.get<Maintanance[]>(
      'http://localhost:8080/maintenance/getAllSchedule'
    );
  }

  private isSameDateTime(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes()
    );
  }

  getAlertMessage(): Observable<string> {
    return this.alertMessage$;
  }

  // constructor() {
  //   this.alertMessage$ = interval(1000).pipe(
  //     map(() => {
  //       if (this.alertTime && new Date() >= this.alertTime) {
  //         return 'SAMS';
  //       }
  //       return '';
  //     })
  //   );
  // }

  // setAlertTime(time: Date) {
  //   this.alertTime = time;
  // }

  // getAlertMessage(): Observable<string> {
  //   return this.alertMessage$;
  // }
}
