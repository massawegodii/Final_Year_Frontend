import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../../../_constants/global-constant';
import { UserService } from '../../../_services/user.service';
import { User } from '../../../_model/users_model';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
})
export class ProfileSettingsComponent implements OnInit {
  profileForm!: FormGroup;
  responseMessage: any;
  loggedUser: User | null = null;

  constructor(
    private toastr: ToastrService,
    private userServices: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
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
      jobTitle: [null, Validators.required],
      bio: [null, Validators.required],

      imageUrl: [null, Validators.required],
    });

    this.profileDetails();
  }

  // Getting the Current Logged user
  public profileDetails() {
    this.userServices.getCurrentUser().subscribe((response) => {
      console.log(response);
      if (Array.isArray(response)) {
        this.loggedUser = response[0];
      } else {
        this.loggedUser = response;
      }

      if (this.loggedUser) {
        this.profileForm.patchValue({
          userName: this.loggedUser.userName,
          userFirstName: this.loggedUser.userFirstName,
          userLastName: this.loggedUser.userLastName,
          phoneNumber: this.loggedUser.phoneNumber,
          email: this.loggedUser.email,
          userPassword: this.loggedUser.userPassword,
          role: this.loggedUser.role,
          jobTitle: this.loggedUser.jobTitle,
          bio: this.loggedUser.bio,
          imageUrl: this.loggedUser.imageUrl,
        });
      }

      console.log('Logged User!');
    });
  }

  public editProfile() {
    var formData = this.profileForm.value;
    var data = {
      userName: this.loggedUser?.userName,
      userFirstName: formData.userFirstName,
      userLastName: formData.userLastName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      jobTitle: formData.jobTitle,
      bio: formData.bio,
    };

    this.userServices.updateUsers(data).subscribe(
      (response: any) => {
        this.toastr.success('Updating the Profile ...');
        this.profileDetails();
        window.location.reload();
      },
      (error) => {
        if (error.error?.message) {
          this.toastr.error(error.error?.message, GlobalConstant.error);
        } else {
          this.toastr.error(GlobalConstant.genericError, GlobalConstant.error);
        }
      }
    );
  }

  add() {
    var formData = this.profileForm.value;
    var data = {
      userName: formData.userName,
      userFirstName: formData.userFirstName,
      userLastName: formData.userLastName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
    };
    this.userServices.addUser(data).subscribe(
      (response: any) => {
        this.toastr.success('Updating the Profile ...!');
        this.profileDetails();
      },
      (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.error(this.responseMessage, GlobalConstant.error);
      }
    );
  }
}
