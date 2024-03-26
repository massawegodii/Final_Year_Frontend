import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '../_model/department-model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private httpClient: HttpClient) { }

  public addDepartment(data: any) {
    return this.httpClient.post<Department>("http://localhost:8080/department/add", data);
  }

  public getAllDepartment() {
    return this.httpClient.get<Department[]>("http://localhost:8080/department/getAllDepartment");
  }


  public updateDepartment(data: any) {
    return this.httpClient.post<Department[]>("http://localhost:8080/department/updateDepartment", data);
  }
  
  public deleteDepartment(id:number) {
    return this.httpClient.delete("http://localhost:8080/department/deleteDepartment/" +id);
  }
}
