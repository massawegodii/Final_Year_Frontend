import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, Role } from '../../../_model/users_model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../_services/snackbar.service';
import { UserService } from '../../../_services/user.service';
import { GlobalConstant } from '../../../_constants/global-constant';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from '../../../_services/user-auth.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent implements OnInit {
  password = true;
  addUserForm: any = FormGroup;
  responseMessage: any;
  onAddDepartment = new EventEmitter();
  onEditDepartment = new EventEmitter();
  dialogAction: any = 'Add';
  action: any = 'Add';

  public users: User[] = [];
  // Dissable the password Onedit
  isEditMode: boolean = false;

  role: Role[] = [];
  selectedUser: User | null = null; // Property to store the selected user for editing

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private userServices: UserService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private authService: UserAuthService,
    private dialogRef: MatDialogRef<AddEmployeeComponent>
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

      phoneNumber: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.emailRegex)],
      ],

      userPassword: [null, [Validators.required]],

      role: [null, Validators.required],

      imageUrl: [null, Validators.required],
    });

    this.getAllUsers();

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.addUserForm.patchValue(this.dialogData.data);
      this.isEditMode = true;
    }
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  edit() {
    var formData = this.addUserForm.value;
    var trimmedPhoneNumber = formData.phoneNumber.trim();
    var data = {
      userName: this.dialogData.data.userName,
      userFirstName: formData.userFirstName,
      userLastName: formData.userLastName,
      imageUrl: formData.imageUrl,
      phoneNumber: trimmedPhoneNumber,
      email: formData.email,
      userPassword: formData.userPassword,
      role: formData.role,
    };

    this.userServices.updateUsers(data).subscribe(
      (response: any) => {
        this.onAddDepartment.emit();
        this.responseMessage = response?.message;
        this.toastr.success("Employee Updated Successfully")
        this.responseMessage = response?.message;
        this.dialogRef.close();
        window.location.reload();
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.error(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }


  add() {
    const formData = this.addUserForm.value;
    const data = {
      userName: formData.userName,
      userFirstName: formData.userFirstName,
      userLastName: formData.userLastName,
      imageUrl: formData.imageUrl,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      userPassword: formData.userPassword,
      role: formData.role,
    };
    // Adding new user
    this.userServices.addUser(data).subscribe(
      (response: any) => {
        window.location.reload();
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.toastr.success('Successfully Registered!');
        this.dialogRef.close();
        this.addUserForm.reset();
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.error(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }

  public getAllUsers() {
    return this.userServices.getAllUsers().subscribe(
      (response: User[]) => {
        console.log(response);
        this.users = response;
        this.ngxService.stop();

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
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.error(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }
}
