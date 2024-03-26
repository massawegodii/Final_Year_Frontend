import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StatusNewComponent } from '../status-new/status-new.component';
import { Status } from './../../_model/status_model';
import { StatusService } from '../../_services/status.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../_services/snackbar.service';
import { GlobalConstant } from '../../_constants/global-constant';
import { ViewStatusComponent } from '../extra/view-status/view-status.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent implements OnInit {
  responseMessage: any;

  constructor(
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private statusService: StatusService,
    private router: Router
  ) {}

  displayedColumns: string[] = ['Status Id', 'Status Name', 'Actions'];
  dataSource: Status[] = [];

  ngOnInit(): void {
    this.ngxService.start();
    this.tableStatus();
  }

  public tableStatus() {
    this.statusService.getAllStatus().subscribe(
      (response: Status[]) => {
        this.ngxService.stop();
        this.dataSource = response;
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

  addNewStatus() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '550px';
    const dialogRef = this.dialog.open(StatusNewComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddStatus.subscribe(
      (response: any) => {
        this.tableStatus();
      }
    );
  }

  editStatus(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };

    dialogConfig.width = '550px';
    const dialogRef = this.dialog.open(StatusNewComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddStatus.subscribe(
      (response: any) => {
        this.tableStatus();
      }
    );
  }

  public deleteStatus(id: any) {
    this.ngxService.start();
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this User?'
    );

    if (isConfirmed) {
      this.statusService.deleteStatus(id).subscribe(
        (response: any) => {
          this.ngxService.stop();
          this.responseMessage = response?.message;
          this.snackbarService.openSnackBar(this.responseMessage, 'success');
          this.tableStatus();
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
        });
    } else {
      console.log('Deletion canceled.');
      this.ngxService.stop();
    }
  }


  viewStatusList(id: number): void {
    this.statusService.viewStatusById(id).subscribe((response: Status[]) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '350px';
      dialogConfig.data = {
        status: response,
      };
      this.dialog.open(ViewStatusComponent, dialogConfig);
    });
  }
}
