import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentsNewComponent } from '../departments-new/departments-new.component';
import { DepartmentService } from '../../_services/department.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../_services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Department } from '../../_model/department-model';
import { GlobalConstant } from '../../_constants/global-constant';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent implements OnInit{
  responseMessage: any;
  displayedColumns: string[] = ['Department Id', 'Department Name', 'Actions'];
  dataSource: Department[] = [];

  constructor(
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private departmentService: DepartmentService,
    private router: Router){}

  ngOnInit(): void {
    this.ngxService.start();
    this.departmentTable();
  }



  public departmentTable() {
    this.departmentService.getAllDepartment().subscribe(
      (response: Department[]) => {
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

  addDepartment() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '550px';
    const dialogRef = this.dialog.open(DepartmentsNewComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddDepartment.subscribe(
      (response: any) => {
        this.departmentTable();
      }
    );
  }


  editDepartment(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };

    dialogConfig.width = '550px';
    const dialogRef = this.dialog.open(DepartmentsNewComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddDepartment.subscribe(
      (response: any) => {
        this.departmentTable();
      }
    );
  }

  deleteDepartment(id: any) {
    this.ngxService.start();
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this User?'
    );

    if (isConfirmed) {
      this.departmentService.deleteDepartment(id).subscribe(
        (response: any) => {
          this.ngxService.stop();
          this.responseMessage = response?.message;
          this.snackbarService.openSnackBar(this.responseMessage, 'success');
          this.departmentTable();
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


}
