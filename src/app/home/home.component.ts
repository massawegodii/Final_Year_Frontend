import { DeleteScheduleComponent } from '../components/extra/delete-schedule/delete-schedule.component';
import { Component, OnInit } from '@angular/core';
import { Chat } from '../_model/chat_models';
import { ChatService } from '../_services/chat.service';
import { DashboardService } from '../_services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../_services/snackbar.service';
import { GlobalConstant } from '../_constants/global-constant';
import { MaintenanceService } from '../_services/maintenance.service';
import { Maintanance } from '../_model/maintanance_model';
import { MatDialog } from '@angular/material/dialog';

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
  itemsPerPage: number = 3;
  totalItems: number = 21;

  maintenanceDetails: Maintanance[] = [];
  displayedColumns: string[] = ['Information', 'Date', 'Time', 'Actions'];

  constructor(
    private dashboardService: DashboardService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private maintenanceService: MaintenanceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllSchedule();
    this.ngxService.start();
    this.dashboardDetails();

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: ['Assets', 'Total Employees', 'Maintenance', 'Reports'],
      datasets: [
        {
          label: 'SAMS GRAPH',
          data: [540, 325, 702, 620],
          backgroundColor: [
            'rgba(0, 27, 240, 0.8)',
            'rgba(3, 107, 3, 0.76)',
            'rgba(151, 171, 7, 0.76)',
            'rgba(201, 6, 160, 0.81)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
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
        this.ngxService.stop();
        this.data = response;
        console.log(response);
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }

  public getAllSchedule() {
    this.maintenanceService.getAllSechedule().subscribe(
      (response: Maintanance[]) => {
        this.maintenanceDetails = response;
        console.log(response);
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
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }
}
