import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../_model/category-model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }
  
  public addCategory(data: any) {
    return this.httpClient.post<Category>("http://localhost:8080/category/add", data);
  }

  public getAllCategory() {
    return this.httpClient.get<Category[]>("http://localhost:8080/category/getAllCategory");
  }


  public updateCategory(data: any) {
    return this.httpClient.post<Category[]>("http://localhost:8080/category/updateCategory", data);
  }
  
  public deleteCategory(id:number) {
    return this.httpClient.delete("http://localhost:8080/category/deleteCategory/" +id);
  }
}
