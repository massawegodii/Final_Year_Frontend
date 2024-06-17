import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentsNewComponent } from '../departments-new/departments-new.component';
import { DepartmentService } from '../../_services/department.service';
import { Router } from '@angular/router';
import { Department } from '../../_model/department-model';
import { GlobalConstant } from '../../_constants/global-constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss',
})
export class DepartmentsComponent implements OnInit {
  responseMessage: any;
  displayedColumns: string[] = ['Department Id', 'Department Name', 'Actions'];
  dataSource: Department[] = [];

  constructor(
    private dialog: MatDialog,
    private departmentService: DepartmentService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.departmentTable();
  }

  public departmentTable() {
    this.departmentService.getAllDepartment().subscribe(
      (response: Department[]) => {
        this.dataSource = response;
      },
      (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.info(
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
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this User?'
    );

    if (isConfirmed) {
      this.departmentService.deleteDepartment(id).subscribe(
        (response: any) => {
          this.responseMessage = response?.message;
          this.toastr.success('Department deleted successfully');
          this.departmentTable();
        },
        (error) => {
          if (error.error?.message) {
            this.responseMessage = error.error?.message;
          } else {
            this.responseMessage = GlobalConstant.genericError;
          }
          this.toastr.info(
            this.responseMessage,
            GlobalConstant.error
          );
        }
      );
    } else {
      console.log('Deletion canceled.');
    }
  }
}
