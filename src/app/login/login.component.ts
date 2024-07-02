import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { GlobalConstant } from '../_constants/global-constant';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { UserAuthService } from '../_services/UserAuthService';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  userPassword = true;
  loginForm: any = NgForm;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private userService: UserService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: [null],
      userPassword: [null, [Validators.required]],
    });
  }

  login() {
    var formData = this.loginForm.value;
    this.ngxLoader.start();

    var data = {
      userName: formData.userName,
      userPassword: formData.userPassword,
    };

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.userService.login(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.ngxLoader.stop();
        this.responseMessage = response?.message;
        this.toastr.success('Sucessfully Login in your account!');

        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);

        const role = response.user.role[0].roleName;
        if (role === 'Admin') {
          this.router.navigate(['/dashboard/home']);
        } else {
          this.router.navigate(['/userpage']);
        }
      },
      (error: any) => {
        console.log(error);
        this.ngxLoader.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.error('Invalid credentials!');
      }
    );
  }
}
