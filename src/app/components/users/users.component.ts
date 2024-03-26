import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../_services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from '../../_constants/global-constant';
import { Role, User } from './../../_model/users_model';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  password = true;
  addUserForm: any = FormGroup;
  responseMessage: any;
  role: Role[] = [];
  selectedUser: User | null = null; // Property to store the selected user for editing
 

  constructor(
    private router: Router,
    private userServices: UserService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService
  ) {
    this.role = [];
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

      role: [null, Validators.required]
    });

    this.ngxService.start();

    this.getAllUsers();
  }

  dataSource : User[] = [];
  displayedColumns: string[] = [
    'Username', 
    'First Name', 
    'Last Name', 
    'Email', 
    'Role',
    'Actions'
  ];




  validationSubmit(){
    if(this.addUserForm.controls['password'].value != this.addUserForm.controls['confirmPassword'].value){
      return true;
    }
    else {
      return false;
    }
  }



  handleSubmit() {
    this.ngxService.start();
    const formData = this.addUserForm.value;
    const data = {
      userName: formData.userName,
      userFirstName: formData.userFirstName,
      userLastName: formData.userLastName,
      email: formData.email,
      userPassword: formData.userPassword,
      role: formData.role,
    };

    if (this.selectedUser) {
      // Editing existing user
      data['userName'] = this.selectedUser.userName; // Assuming userId is available in User model
      delete data['role']; // Remove 'role' from data
      this.userServices.updateUsers(data).subscribe(
        (response: any) => {
          this.getAllUsers();
          this.ngxService.stop();
          this.responseMessage = response?.message;
          this.snackbarService.openSnackBar(this.responseMessage, 'success');
          this.router.navigate(['/dashboard/users']);
          this.addUserForm.reset();
          this.selectedUser = null; // Reset selected user after editing
        },
        (error) => {
          this.ngxService.stop();
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
    } else {
      // Adding new user
      this.userServices.addUser(data).subscribe(
        (response: any) => {
          this.getAllUsers();
          this.ngxService.stop();
          this.responseMessage = response?.message;
          this.snackbarService.openSnackBar(this.responseMessage, 'success');
          this.router.navigate(['/dashboard/users']);
          this.addUserForm.reset();
        },
        (error) => {
          this.ngxService.stop();
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
  }


  public getAllUsers() {
    return this.userServices.getAllUsers().subscribe((response: User[]) => {
      console.log(response);
      this.dataSource = response;
      this.ngxService.stop();

       // Extract all roles dynamically
       const roles: Role[] = [];
       response.forEach(user => {
         if (user.role && user.role.length > 0) {
           user.role.forEach(role => {
             // Check if the role is already in the roles array
             const existingRole = roles.find(r => r.roleName === role.roleName);
             if (!existingRole) {
               roles.push(role);
             }
           });
         }
       });
       
       this.role = roles;
    },
    (error) => {
      this.ngxService.stop();
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


  public deleteUsers(userName: any) {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this User?'
    );

    if (isConfirmed) {
      this.userServices.deleteUsers(userName).subscribe(
        (response:any) => {
          this.getAllUsers();
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
    } else {
      // User cancelled the deletion
      console.log('Deletion canceled.');
    }
  }


  handleEditAction(user: User) {
    // Populate form with selected user's data for editing
    this.selectedUser = user;
    this.addUserForm.patchValue({
      userName: user.userName,
      userFirstName: user.userFirstName,
      userLastName: user.userLastName,
      email: user.email,
      userPassword: user.userPassword,
      role: user.role
    });
  }

    
}
