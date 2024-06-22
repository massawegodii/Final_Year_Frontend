import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Report } from '../_model/report_models';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private httpClient: HttpClient) {}

  public generateReport(data: any) {
    return this.httpClient.post(
      'http://localhost:8080/bill/generateReport',
      data
    );
  }

  public getPdf(data: any): Observable<Blob> {
    return this.httpClient.post('http://localhost:8080/bill/getPdf', data, {
      responseType: 'blob',
    });
  }

  public getBills() {
    return this.httpClient.get<Report[]>('http://localhost:8080/bill/getBills');
  }

  public generateProductPdf(): Observable<Blob> {
    return this.httpClient.get('http://localhost:8080/products/report', {
      responseType: 'blob',
    });
  }
}
