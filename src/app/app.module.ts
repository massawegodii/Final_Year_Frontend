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
import { MatTableModule } from '@angular/material/table';
import { AssetsComponent } from './components/assets/assets.component';
import { ReportsComponent } from './components/reports/reports.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AssetsNewComponent } from './components/assets-new/assets-new.component';
import { UsersComponent } from './components/users/users.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { MatSelectModule } from '@angular/material/select';
import { DepartmentsNewComponent } from './components/departments-new/departments-new.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoryNewComponent } from './components/category-new/category-new.component';
import { StatusComponent } from './components/status/status.component';
import { StatusNewComponent } from './components/status-new/status-new.component';
import { MaintananceComponent } from './components/maintanance/maintanance.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ToastrModule } from 'ngx-toastr';
import { DragDirective } from './_services/drag.directive';
import { ShowImageDialogComponent } from './components/show-image-dialog/show-image-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssetEditComponent } from './components/asset-edit/asset-edit.component';
import { ViewStatusComponent } from './components/extra/view-status/view-status.component';
import { UserPageComponent } from './user-page/user-page.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ShareComponent } from './components/extra/share/share.component';
import { DeleteAssetComponent } from './components/extra/delete-asset/delete-asset.component';
import { ConfirmationComponent } from './components/extra/confirmation/confirmation.component';
import { ChangePasswordComponent } from './components/extra/change-password/change-password.component';
import { QrCodeComponent } from './components/extra/qr-code/qr-code.component';
import { AddEmployeeComponent } from './components/extra/add-employee/add-employee.component';
import { DeleteEmployeeComponent } from './components/extra/delete-employee/delete-employee.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from './components/extra/pagination/pagination.component';
import { RequestAssetComponent } from './components/request-asset/request-asset.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MyRequestComponent } from './components/my-request/my-request.component';
import { DeleteStatusComponent } from './components/extra/delete-status/delete-status.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MessagingComponent } from './components/extra/messaging/messaging.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DeleteScheduleComponent } from './components/extra/delete-schedule/delete-schedule.component';
import { TextMessageComponent } from './components/extra/text-message/text-message.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { ReportPageComponent } from './components/extra/report-page/report-page.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ProfileComponent } from './components/extra/profile/profile.component';
import { UpdatesComponent } from './components/extra/updates/updates.component';
import { UserProfileComponent } from './components/extra/user-profile/user-profile.component';
import { GeneralReportComponent } from './components/extra/general-report/general-report.component';
import { UserReportComponent } from './components/extra/user-report/user-report.component';
import { ProfileSettingsComponent } from './components/extra/profile-settings/profile-settings.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: 'Loading ...',
  textColor: '#FFFFFF',
  textPosition: 'center-center',
  bgsColor: '#00FF00',
  fgsColor: '#00FF00',
  fgsType: SPINNER.ballSpin,
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
    DeleteAssetComponent,
    ConfirmationComponent,
    ChangePasswordComponent,
    QrCodeComponent,
    AddEmployeeComponent,
    DeleteEmployeeComponent,
    PaginationComponent,
    RequestAssetComponent,
    MyRequestComponent,
    DeleteStatusComponent,
    MessagingComponent,
    DeleteScheduleComponent,
    TextMessageComponent,
    ReportPageComponent,
    ProfileComponent,
    UpdatesComponent,
    UserProfileComponent,
    GeneralReportComponent,
    UserReportComponent,
    ProfileSettingsComponent,
  ],
  imports: [
    HttpClientModule,
    RouterModule,
    BrowserModule,
    ChartModule,
    ButtonModule,
    AppRoutingModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatTreeModule,
    MatToolbarModule,
    MatExpansionModule,
    MatCardModule,
    MatChipsModule,
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
    NgxPaginationModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    ClipboardModule,
    FullCalendarModule,
    MatAutocompleteModule,
    AngularFireStorageModule,
    AngularFirestoreModule,

    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyBYRHE3SnJJbKwMqEekGuN7mgWEhGbjvvI',
      authDomain: 'sams-chat-app-20920.firebaseapp.com',
      projectId: 'sams-chat-app-20920',
      storageBucket: 'sams-chat-app-20920.appspot.com',
      messagingSenderId: '1020410639848',
      appId: '1:1020410639848:web:eb30e38c8b04058272e05d',
    }),

    NgxMaterialTimepickerModule.setOpts('en-KE'),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    UserService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
