import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ForbidentComponent } from './forbident/forbident.component';
import { AssetsComponent } from './components/assets/assets.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { UsersComponent } from './components/users/users.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { CategoryComponent } from './components/category/category.component';
import { StatusComponent } from './components/status/status.component';
import { MaintananceComponent } from './components/maintanance/maintanance.component';
import { AuthGuard } from './_auth/auth.guard';
import { UserPageComponent } from './user-page/user-page.component';
import { ReportPageComponent } from './components/extra/report-page/report-page.component';
import { GeneralReportComponent } from './components/extra/general-report/general-report.component';
import { UserReportComponent } from './components/extra/user-report/user-report.component';
import { ProfileSettingsComponent } from './components/extra/profile-settings/profile-settings.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'userpage',
    component: UserPageComponent,
    canActivate: [AuthGuard],
    data: { roles: ['User'] },
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'assets', component: AssetsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'departments', component: DepartmentsComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'status', component: StatusComponent },
      { path: 'maintainance', component: MaintananceComponent },
      { path: 'reportpage', component: ReportPageComponent },
      { path: 'generalreport', component: GeneralReportComponent },
      { path: 'usereport', component: UserReportComponent },
      { path: 'profile', component: ProfileSettingsComponent },
    ],
  },

  { path: 'forbidden', component: ForbidentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
