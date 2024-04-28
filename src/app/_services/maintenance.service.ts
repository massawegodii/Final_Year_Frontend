import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Maintanance } from '../_model/maintanance_model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(private httpClient: HttpClient) { }

  public addMaintanance(data: any) {
    return this.httpClient.post<Maintanance[]>("http://localhost:8080/maintenance/add", data);
  }

  public getAllSechedule() {
    return this.httpClient.get<Maintanance[]>("http://localhost:8080/maintenance/getAllSchedule");
  }
}
