import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../_services/department.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../_services/snackbar.service';
import { GlobalConstant } from '../../_constants/global-constant';

@Component({
  selector: 'app-departments-new',
  templateUrl: './departments-new.component.html',
  styleUrl: './departments-new.component.scss'
})
export class DepartmentsNewComponent implements OnInit{
  responseMessage: any;
  departmentForm: any = FormGroup;
  onAddDepartment = new EventEmitter();
  onEditDepartment = new EventEmitter();
  dialogAction: any = "Add";
  action: any = "Add";
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private router: Router,
  private departmentService: DepartmentService,
  private formBuilder: FormBuilder,
  private snackbarService: SnackbarService,
  private ngxService: NgxUiLoaderService,
  private dialogRef: MatDialogRef<DepartmentsNewComponent>){}

  ngOnInit(): void {
    this.departmentForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.departmentForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.departmentForm.value;
    var data = {
      name: formData.name,
    };
    this.departmentService.addDepartment(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddDepartment.emit();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
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

  edit() {
    var formData = this.departmentForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
    };
    this.departmentService.updateDepartment(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddDepartment.emit();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
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
  }

}
