import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../_services/user.service';
import { GlobalConstant } from '../../../_constants/global-constant';
import { ToastrService } from 'ngx-toastr';

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
    private userServices: UserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
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
    const formData = this.changePasswordForm.value;
    const data = {
      email: formData.email,
      newPassword: formData.newPassword,
    };

    this.userServices.changePassword(data).subscribe(
      (response: any) => {
        this.responseMessage = response?.message;
        this.toastr.success('Password changed successfully!');
        this.changePasswordForm.reset();
      },
      (error) => {
        this.toastr.error('Invalid provided email.');
      }
    );
  }
}
