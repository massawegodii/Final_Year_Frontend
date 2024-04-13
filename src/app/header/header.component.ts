import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/extra/confirmation/confirmation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {}
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService,
    private dialog : MatDialog
  ) {}

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  
  fetchData() {
    window.open('http://localhost:8080/', '_blank');
  }


  public logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout',
      confirmation: true
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitterStatusChange.subscribe((response) => {
      dialogRef.close();
      this.userAuthService.clear();
      this.router.navigate(['/']);
    });
  }

}
