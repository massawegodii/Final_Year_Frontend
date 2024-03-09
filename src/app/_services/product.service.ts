import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../_model/product_model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  public addProduct(data: any) {
    return this.httpClient.post<Product>("http://localhost:8080/products/addNewProduct", data);
  }
}
