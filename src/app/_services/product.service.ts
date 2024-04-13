import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../_model/product_model';
import { Assign } from '../_model/assign_model';
import { Request } from '../_model/request-asset';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  public addProduct(data: any) {
    return this.httpClient.post<Product>("http://localhost:8080/products/addNewProduct", data);
  }

  public getAllProduct() {
    return this.httpClient.get<Product[]>("http://localhost:8080/products/getAllProducts");
  }

  public getAllAssignById(data: any) {
    return this.httpClient.get<Assign[]>("http://localhost:8080/products/getAssignById/" +data);
  }


  public getAllAssign() {
    return this.httpClient.get<Assign[]>("http://localhost:8080/assign/getAssignDetails");
  }

  public getProductDetailsById(data: any) {
    return this.httpClient.get<Product[]>("http://localhost:8080/products/getProductDetailsById/" +data);
  }

  public updateAssets(data: any) {
    return this.httpClient.post<Product[]>("http://localhost:8080/products/updateAssets", data);
  }
  
  public deleteProductDetails(productId:number) {
    return this.httpClient.delete("http://localhost:8080/products/deleteProductDetails/"+ productId);
  }

  public assignToUser(data: any) {
    return this.httpClient.post<Assign[]>("http://localhost:8080/assign/assignToUser", data);
  }

  public unAssignUserProduct(productId: number, userName: string) {
    return this.httpClient.delete<any>("http://localhost:8080/assign/unAssignUser/"+ productId + "/" + userName);
  }

  public requestAssets(data: any) {
    return this.httpClient.post<Request[]>("http://localhost:8080/request/asset", data);
  }

  public getAllRequestByUsername() {
    return this.httpClient.get<Request[]>("http://localhost:8080/request/getAllRequestByUsername");
  }

  public getAllRequest() {
    return this.httpClient.get<Request[]>("http://localhost:8080/request/getAllRequest");
  }

  
  public changeRequestStatus(id: number, status: string) {
    return this.httpClient.get<Request[]>(`http://localhost:8080/request/changeStatus/${id}/${status}`);
  }

  public deleteRequest(id:number) {
    return this.httpClient.delete("http://localhost:8080/request/deleteRequest/"+ id);
  }

}
