import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../_services/snackbar.service';
import { UserService } from '../../../_services/user.service';
import { GlobalConstant } from '../../../_constants/global-constant';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit {
  password = true;
  changePasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private router: Router,
    private userServices: UserService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.emailRegex)],
      ],

      newPassword: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(5)],
      ],
    });
  }

  handleChangePasswordSubmit() {
    this.ngxService.start();
    const formData = this.changePasswordForm.value;
    const data = {
      email: formData.email,
      newPassword: formData.newPassword,
    };

    this.userServices.changePassword(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
        // this.router.navigate(['/userpage']);
        this.changePasswordForm.reset();
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
