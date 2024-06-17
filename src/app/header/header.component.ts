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

  public logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout',
      confirmation: true,
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitterStatusChange.subscribe(
      (response) => {
        dialogRef.close();
        this.userAuthService.clear();
        this.toastr.success('You have logout in your account!');
        this.router.navigate(['/']);
      }
    );
  }

  openProfile() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(ProfileComponent);
    this.offcanvasBody.clear();
    this.offcanvasBody.createComponent(componentFactory);
  }

  updateAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '750px';
    dialogConfig.height = '500px';
    dialogConfig.position = { top: '0' };
    this.dialog.open(UpdatesComponent, dialogConfig);
  }
}
