import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrcodeService {

  constructor(private httpClient: HttpClient) { }

  generateQRCode(productId: number): Observable<Blob> {
    return this.httpClient.get(`http://localhost:8080/qr/generate/${productId}`, { responseType: 'blob' });
  }
}
