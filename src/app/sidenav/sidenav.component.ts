import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { User } from '../_model/users_model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  loggedUser: User | null = null;
  constructor(private userServices: UserService) {}
  ngOnInit(): void {
    this.LoggedDetails();
  }

  //Getting the Current Logged user
  public LoggedDetails() {
    this.userServices.getCurrentUser().subscribe((response) => {
      console.log(response);
      if (Array.isArray(response)) {
        this.loggedUser = response[0];
      } else {
        this.loggedUser = response;
      }
      console.log('Logged User!');
    });
  }
}
