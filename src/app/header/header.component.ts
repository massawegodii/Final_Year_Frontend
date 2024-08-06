import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/UserAuthService';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/extra/confirmation/confirmation.component';
import { DarkmodeService } from '../_services/darkmode.service';
import { ProfileComponent } from '../components/extra/profile/profile.component';
import { ToastrService } from 'ngx-toastr';
import { UpdatesComponent } from '../components/extra/updates/updates.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @ViewChild('offcanvasBody', { read: ViewContainerRef })
  offcanvasBody!: ViewContainerRef;

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  darkModeServices: DarkmodeService = inject(DarkmodeService);

  toggleDarkMode() {
    this.darkModeServices.updateDarkMode();
  }

  ngOnInit(): void {}
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  fetchData() {
    window.open('http://localhost:8080/', '_blank');
  }

  updateAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '750px';
    dialogConfig.height = '500px';
    dialogConfig.position = { top: '0' };
    this.dialog.open(UpdatesComponent, dialogConfig);
  }

  public logout() {
    const dialogConfig = new MatDialogConfig();
     dialogConfig.width = '350px';
    dialogConfig.data = {
      message: 'logout',
      confirmation: true,
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitterStatusChange.subscribe(
      (response) => {
        dialogRef.close();
        this.clearCacheAndSession();
        this.userAuthService.clear();
        this.toastr.success('You have logout in your account! Welcome to SAMS');
        this.router.navigate(['/']);
      }
    );
  }

  private clearCacheAndSession() {
    localStorage.clear();
    sessionStorage.clear();
    this.clearCookies();
  }

  private clearCookies() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
  }
}
