import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { GlobalConstant } from '../_constants/global-constant';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../_services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserAuthService } from '../_services/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {

  userPassword = true;
  loginForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private userService: UserService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private userAuthService: UserAuthService
  ) {}
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: [
        null,
      ],
      userPassword: [null, [Validators.required]],
    });
  }


  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;

    var data = {
      userName: formData.userName,
      userPassword: formData.userPassword
    }

    this.userService.login(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();

      this.userAuthService.setRoles(response.user.role);
      this.userAuthService.setRoles(response.jwtToken);
    
      const role = response.user.role[0].roleName;
      console.log(response.user.role);
      if(role === 'Admin'){
        this.router.navigate(['/dashboard/home']);
      }else{
        this.router.navigate(['/']);
      }

    }, (error:any)=>{
      console.log(error);
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstant.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstant.error);
    })
  }
}