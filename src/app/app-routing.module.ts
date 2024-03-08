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

const routes: Routes = [

  { path: '', component: WelcomeComponent},


  {
    path: 'dashboard',
    component: DashboardComponent,
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
    ],
  },
  { path: 'forbidden', component: ForbidentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
