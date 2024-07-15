import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StatusNewComponent } from '../status-new/status-new.component';
import { Status } from './../../_model/status_model';
import { StatusService } from '../../_services/status.service';
import { Router } from '@angular/router';
import { GlobalConstant } from '../../_constants/global-constant';
import { ViewStatusComponent } from '../extra/view-status/view-status.component';
import { ToastrService } from 'ngx-toastr';
import { DeleteStatusComponent } from '../extra/delete-status/delete-status.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent implements OnInit {
  responseMessage: any;

  constructor(
    private dialog: MatDialog,
    private statusService: StatusService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  displayedColumns: string[] = ['Status Id', 'Status Name', 'Actions'];
  dataSource: Status[] = [];

  ngOnInit(): void {
    this.tableStatus();
  }

  public tableStatus() {
    this.statusService.getAllStatus().subscribe(
      (response: Status[]) => {
        this.dataSource = response;
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
    const dialogRef = this.dialog.open(DeleteStatusComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.statusService.deleteStatus(id).subscribe(
          (response: any) => {
            this.responseMessage = response?.message;
            this.toastr.success('Status deleted Successfully!');
            this.tableStatus();
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
      } else {
        console.log('Deletion canceled.');
      }
    });
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
