import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor() {}

  simulateLoading(data: any) {
    return of(data).pipe(delay(5000));
  }
}
