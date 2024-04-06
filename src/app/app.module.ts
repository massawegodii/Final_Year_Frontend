import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER } from 'ngx-ui-loader';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ForbidentComponent } from './forbident/forbident.component';
import { UserService } from './_services/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './_auth/auth-interceptor';
import { AuthGuard } from './_auth/auth.guard';
import {MatTableModule} from '@angular/material/table';
import { AssetsComponent } from './components/assets/assets.component';
import { ReportsComponent } from './components/reports/reports.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AssetsNewComponent } from './components/assets-new/assets-new.component';
import { UsersComponent } from './components/users/users.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import {MatSelectModule} from '@angular/material/select';
import { DepartmentsNewComponent } from './components/departments-new/departments-new.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoryNewComponent } from './components/category-new/category-new.component';
import { StatusComponent } from './components/status/status.component';
import { StatusNewComponent } from './components/status-new/status-new.component';
import { MaintananceComponent } from './components/maintanance/maintanance.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { ToastrModule } from 'ngx-toastr';
import { DragDirective } from './_services/drag.directive';
import { ShowImageDialogComponent } from './components/show-image-dialog/show-image-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AssetEditComponent } from './components/asset-edit/asset-edit.component';
import { ViewStatusComponent } from './components/extra/view-status/view-status.component';
import { UserPageComponent } from './user-page/user-page.component';
import {MatBadgeModule} from '@angular/material/badge';
import { ShareComponent } from './components/extra/share/share.component';
import { ReturnAssetComponent } from './components/extra/return-asset/return-asset.component';
import { DeleteAssetComponent } from './components/extra/delete-asset/delete-asset.component';
import { ConfirmationComponent } from './components/extra/confirmation/confirmation.component';
import { ChangePasswordComponent } from './components/extra/change-password/change-password.component';
import { QrCodeComponent } from './components/extra/qr-code/qr-code.component';
import { EmployeeComponent } from './components/employee/employee.component';



const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: 'Loading ...',
  textColor: '#FFFFFF',
  textPosition: 'center-center',
  bgsColor: '#00FF00',
  fgsColor: '#00FF00',
  fgsType: SPINNER.squareJellyBox,
  fgsSize: 100,
  hasProgressBar: false,
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    HomeComponent,
    DashboardComponent,
    WelcomeComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ForbidentComponent,
    AssetsComponent,
    ReportsComponent,
    NotificationsComponent,
    AssetsNewComponent,
    UsersComponent,
    DepartmentsComponent,
    DepartmentsNewComponent,
    CategoryComponent,
    CategoryNewComponent,
    StatusComponent,
    StatusNewComponent,
    MaintananceComponent,
    DragDirective,
    ShowImageDialogComponent,
    AssetEditComponent,
    ViewStatusComponent,
    UserPageComponent,
    ShareComponent,
    ReturnAssetComponent,
    DeleteAssetComponent,
    ConfirmationComponent,
    ChangePasswordComponent,
    QrCodeComponent,
    EmployeeComponent,

  ],
  imports: [
    HttpClientModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatGridListModule,
    MatTooltipModule,
    MatBadgeModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
