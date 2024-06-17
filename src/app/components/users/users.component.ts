import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../_services/snackbar.service';
import { GlobalConstant } from '../../_constants/global-constant';
import { Role, User } from './../../_model/users_model';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddEmployeeComponent } from '../extra/add-employee/add-employee.component';
import { DeleteEmployeeComponent } from '../extra/delete-employee/delete-employee.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MessagingComponent } from '../extra/messaging/messaging.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  password = true;
  addUserForm: any = FormGroup;
  responseMessage: any;
  user: any;
  userName: any;
  public users: User[] = [];
  public blockedUsers: Set<string> = new Set(); // Set to store blocked users
  public unblockedUsers: Set<string> = new Set(); // Set to store unblocked users

  currentPage = 1;
  itemsPerPage = 8;
  totalUsers: number = 0;
  totalPages: number;
  changePage(page: number) {
    this.currentPage = page;
  }

  get PaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.users.slice(start, end);
  }

  role: Role[] = [];

  constructor(
    private userServices: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {
    this.role = [];
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
  }

  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
      userName: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],

      userFirstName: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],

      userLastName: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],

      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.emailRegex)],
      ],

      userPassword: [null, [Validators.required]],

      role: [null, Validators.required],
    });

    this.getAllUsers();
    this.getUserByUsername(this.userName);
    this.loadToggleState();
  }

  addEmployee() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '650px';
    const dialogRef = this.dialog.open(AddEmployeeComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
      this.getAllUsers();
    });
    const sub = dialogRef.componentInstance.onAddDepartment.subscribe(
      (response: any) => {
        this.getAllUsers();
      }
    );
  }

  editDepartment(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };

    dialogConfig.width = '650px';
    const dialogRef = this.dialog.open(AddEmployeeComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
      this.getAllUsers();
    });
    const sub = dialogRef.componentInstance.onAddDepartment.subscribe(
      (response: any) => {
        this.getAllUsers();
      }
    );
  }

  public getAllUsers() {
    return this.userServices.getAllUsers().subscribe(
      (response: User[]) => {
        // console.log(response);
        this.users = response;
        this.totalUsers = response.length;

        // Extract all roles dynamically
        const roles: Role[] = [];
        response.forEach((user) => {
          if (user.role && user.role.length > 0) {
            user.role.forEach((role) => {
              // Check if the role is already in the roles array
              const existingRole = roles.find(
                (r) => r.roleName === role.roleName
              );
              if (!existingRole) {
                roles.push(role);
              }
            });
          }
        });

        this.role = roles;
      },
      (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }

  public getUserByUsername(userName: any) {
    (
      this.userServices.getUserByUsername(userName) as Observable<any>
    ).subscribe((resp) => {
      console.log('Clicked');
    });
  }

  // Method to toggle between blocking and unblocking a user
  public toggleUser(user: User): void {
    if (this.isBlocked(user.userName)) {
      this.unblockUser(user.userName);
    } else {
      this.blockUser(user.userName);
    }
  }

  // Method to block a user
  private blockUser(userName: string): void {
    const result = this.userServices.blockUser(userName);
    if (result instanceof Observable) {
      result.subscribe(() => {
        this.blockedUsers.add(userName);
        this.unblockedUsers.delete(userName);
        this.saveToggleState();
      });
    } else {
      console.error('Unexpected return type from blockUser');
    }
  }

  // Method to unblock a user
  private unblockUser(userName: string): void {
    const result = this.userServices.unblockUser(userName);
    if (result instanceof Observable) {
      result.subscribe(() => {
        this.unblockedUsers.add(userName);
        this.blockedUsers.delete(userName);
        this.saveToggleState(); // Save toggle state after unblocking user
      });
    } else {
      console.error('Unexpected return type from unblockUser');
    }
  }

  // Method to check if a user is blocked
  public isBlocked(userName: string): boolean {
    return this.blockedUsers.has(userName);
  }

  // Method to save toggle state to local storage
  private saveToggleState(): void {
    localStorage.setItem(
      'blockedUsers',
      JSON.stringify(Array.from(this.blockedUsers))
    );
    localStorage.setItem(
      'unblockedUsers',
      JSON.stringify(Array.from(this.unblockedUsers))
    );
  }

  // Method to load toggle state from local storage
  private loadToggleState(): void {
    const blockedUsersString = localStorage.getItem('blockedUsers');
    const unblockedUsersString = localStorage.getItem('unblockedUsers');
    if (blockedUsersString) {
      this.blockedUsers = new Set(JSON.parse(blockedUsersString));
    }
    if (unblockedUsersString) {
      this.unblockedUsers = new Set(JSON.parse(unblockedUsersString));
    }
  }

  public deleteEmployee(userName: any) {
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      DeleteEmployeeComponent,
      {
        width: '550px',
        data: { userName: userName },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userServices.deleteUsers(userName).subscribe(
          (response: any) => {
            // console.log(userName);
            this.getAllUsers();
          },
          (error: HttpErrorResponse) => {
            console.log(error);
          }
        );
      }
    });
  }

  messagePhone() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.position = { top: '0' };
    this.dialog.open(MessagingComponent, dialogConfig);
  }

  copyPhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.clipboard.copy(phoneNumber);
      this.snackBar.open('Phone number copied to clipboard!', 'Close', {
        duration: 2000,
      });
    }
  }
}
