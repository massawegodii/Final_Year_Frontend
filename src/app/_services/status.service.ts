import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Status } from '../_model/status_model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor(private httpClient: HttpClient) {}

  
  public addStatus(data: any) {
    return this.httpClient.post<Status>("http://localhost:8080/status/add", data);
  }

  public getAllStatus() {
    return this.httpClient.get<Status[]>("http://localhost:8080/status/getAllStatus");
  }

  public viewStatusById(data: any) {
    return this.httpClient.get<Status[]>("http://localhost:8080/status/viewStatusById/" +data);
  }

  public updateStatus(data: any) {
    return this.httpClient.post<Status[]>("http://localhost:8080/status/updateStatus", data);
  }
  
  public deleteStatus(id:number) {
    return this.httpClient.delete("http://localhost:8080/status/deleteStatus/" +id);
  }
}
