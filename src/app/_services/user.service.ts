import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { UserAuthService } from './UserAuthService';
import { User } from '../_model/users_model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit {
  PATH_OF_API = 'http://localhost:8080';

  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });

  ngOnInit(): void {}

  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  public login(data: any) {
    return this.httpClient.post(this.PATH_OF_API + '/authenticate', data, {
      headers: this.requestHeader,
    });
  }

  public addUser(data: any) {
    return this.httpClient.post(
      this.PATH_OF_API + '/user/registerNewUser',
      data,
      {
        headers: this.requestHeader,
      }
    );
  }

  public getAllUsers() {
    return this.httpClient.get<User[]>(
      'http://localhost:8080/user/getAllUsers'
    );
  }

  public deleteUsers(data: any) {
    return this.httpClient.delete(
      'http://localhost:8080/user/deleteUser/' + data
    );
  }

  public updateUsers(data: any) {
    return this.httpClient.post<User[]>(
      'http://localhost:8080/user/updateUser',
      data
    );
  }

  public changePassword(data: any) {
    return this.httpClient.post(
      'http://localhost:8080/user/changePassword',
      data
    );
  }

  public forgotPassword(data: any) {
    return this.httpClient.post(
      'http://localhost:8080/user/forgotPassword',
      data
    );
  }

  public getCurrentUser() {
    return this.httpClient.get<User[]>('http://localhost:8080/user/loggedUser');
  }

  public blockUser(userName: any)  {
    if (userName) {
      return this.httpClient.post(
        `http://localhost:8080/user/block/${userName}`, {}
      );
    } else {
      return throwError('userName is undefined or null');
    }
  }

  public unblockUser(userName: any) {
    if (userName) {
      return this.httpClient.post(
        `http://localhost:8080/user/unblock/${userName}`,{}
      );
    } else {
      return throwError('userName is undefined or null');
    }
  }

  getUserByUsername(userName: any) {
    if (userName) {
      return this.httpClient.get(
        `http://localhost:8080/user/singleUser/${userName}/`
      );
    } else {
      return throwError('userName is undefined or null');
    }
  }

  public roleMatch(allowedRoles: any): boolean {
    let isMatch = false;
    const userRoles: any = this.userAuthService.getRoles();

    if (userRoles != null && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i].roleName === allowedRoles[j]) {
            isMatch = true;
            return isMatch;
          } else {
            return isMatch;
          }
        }
      }
    }
    return false;
  }
}
function throwError(arg0: string) {
  throw new Error('Function not implemented.');
}
