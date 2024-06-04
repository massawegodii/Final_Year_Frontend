import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from '../../../_services/user.service';
import { User } from '../../../_model/users_model';
import { combineLatest, map, startWith } from 'rxjs';

@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.component.html',
  styleUrl: './text-message.component.scss',
})
export class TextMessageComponent implements OnInit {
  searchControl = new FormControl('');

  currentUser = this.userService.getCurrentUser;
  user: User[] = [];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((response: User[]) => {
      this.user = response;
      console.log(response);
    });
  }

  createChat(otherUser: User) {}
}
