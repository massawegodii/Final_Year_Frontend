import { DeleteScheduleComponent } from '../components/extra/delete-schedule/delete-schedule.component';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../_services/dashboard.service';
import { GlobalConstant } from '../_constants/global-constant';
import { MaintenanceService } from '../_services/maintenance.service';
import { Maintanance } from '../_model/maintanance_model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../_services/user.service';
import { UserEvents } from '../_model/user-event';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  responseMessage: any;
  data: any;

  basicData: any;
  basicOptions: any;
  p: number = 1;
  itemsPerPage: number = 30;
  totalItems: number = 60;

  authLogs: any[] = [];

  selectedUserTimestamps: any[] = [];
  showTimestamps: boolean = false;

  maintenanceDetails: Maintanance[] = [];
  displayedColumns: string[] = ['Information', 'Date', 'Time', 'Actions'];

  constructor(
    private dashboardService: DashboardService,
    private maintenanceService: MaintenanceService,
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllSchedule();
    this.dashboardDetails();
    this.getUserEvents();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    const pagesArray: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  public dashboardDetails() {
    this.dashboardService.getDashboardDetails().subscribe(
      (response: any) => {
        this.data = response;
      },
      (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.info(this.responseMessage, GlobalConstant.error);
      }
    );
  }

  public getAllSchedule() {
    this.maintenanceService.getAllSechedule().subscribe(
      (response: Maintanance[]) => {
        this.maintenanceDetails = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteSchedule(id: number) {
    const dialogRef = this.dialog.open(DeleteScheduleComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.maintenanceService.deleteSchedule(id).subscribe(
          (res) => {
            this.getAllSchedule();
            this.toastr.success('Maintenance deleted successfully!');
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  public deleteUserLogging() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to clear user logging activity?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUserTracking().subscribe(
          (response) => {
            this.getUserEvents();
            this.toastr.success('User Logging activity cleared!');
          },
          (error) => {
            this.toastr.warning('Something went wrong');
          }
        );
      }
    });
  }

  public getUserEvents(): void {
    this.userService.getUserEvents().subscribe(
      (response: any) => {
        const groupedLogs = response.reduce((acc: any, log: any) => {
          if (!acc[log.username]) {
            acc[log.username] = {
              username: log.username,
              ipAddress: log.ipAddress,
              attemptCount: 0,
              success: log.success,
              timestamp: log.timestamp,
              timestamps: [],
            };
          }
          acc[log.username].attemptCount += 1;
          acc[log.username].timestamps.push(log.timestamp);

          // Update the success status and timestamp if it's the latest attempt
          if (new Date(log.timestamp) > new Date(acc[log.username].timestamp)) {
            acc[log.username].success = log.success;
            acc[log.username].timestamp = log.timestamp;
          }
          return acc;
        }, {});

        this.authLogs = Object.values(groupedLogs).sort(
          (a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        console.log(this.authLogs);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public viewAllTimestamps(log: any): void {
    this.selectedUserTimestamps = log.timestamps;
    this.showTimestamps = true;
  }

  public closeTimestamps(): void {
    this.showTimestamps = false;
  }
}
