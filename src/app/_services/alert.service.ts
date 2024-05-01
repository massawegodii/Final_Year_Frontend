import { Injectable } from '@angular/core';
import { Observable, interval, map, switchMap, of } from 'rxjs';
import { Maintanance } from '../_model/maintanance_model';
import { MaintenanceService } from './maintenance.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertMessage$: Observable<string>;
  
  private readonly MESSAGE_STORAGE_KEY = 'alert_message';
  private readonly MESSAGE_EXPIRATION_TIME = 2 * 60 * 1000;

  constructor(private maintenanceService: MaintenanceService) {
    this.alertMessage$ = interval(1000).pipe(
      switchMap(() => this.maintenanceService.getAllSechedule()),
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
            // Store the message and its expiration time in sessionStorage
            const expirationTime =
              new Date().getTime() + this.MESSAGE_EXPIRATION_TIME;
            sessionStorage.setItem(
              this.MESSAGE_STORAGE_KEY,
              JSON.stringify({
                message: 'SAMS!',
                expirationTime: expirationTime,
              })
            );
            return 'SAMS!';
          }
        }
        return '';
      })
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
    // Check if the stored message is still valid
    const storedMessage = sessionStorage.getItem(this.MESSAGE_STORAGE_KEY);
    if (storedMessage) {
      const { message, expirationTime } = JSON.parse(storedMessage);
      if (new Date().getTime() < expirationTime) {
        return of(message);
      } else {
        sessionStorage.removeItem(this.MESSAGE_STORAGE_KEY);
      }
    }
    return this.alertMessage$;
  }
}
