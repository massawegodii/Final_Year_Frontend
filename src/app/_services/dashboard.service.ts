import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  public getDashboardDetails() {
    return this.httpClient.get("http://localhost:8080/dashboard/details");
  }
}
