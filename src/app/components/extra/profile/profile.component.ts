import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NonNullableFormBuilder } from '@angular/forms';
import { User } from 'firebase/auth';
import { UserAuthService } from '../../../_services/user-auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  profileForm = this.fb.group({
    uid: [''],
    displayName: [''],
    userFirstName: [''],
    userLastName: [''],
    phoneNumber: [''],
    email: [''],
  });

  constructor(
    private authService: UserAuthService,
    private toastr: ToastrService,
    private fb: NonNullableFormBuilder,
  ) {}

  ngOnInit(): void {

  }





}
