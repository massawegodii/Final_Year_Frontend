import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../_services/department.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from '../../_constants/global-constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-departments-new',
  templateUrl: './departments-new.component.html',
  styleUrl: './departments-new.component.scss',
})
export class DepartmentsNewComponent implements OnInit {
  responseMessage: any;
  departmentForm: any = FormGroup;
  onAddDepartment = new EventEmitter();
  onEditDepartment = new EventEmitter();
  offices: string[] = [];
  dialogAction: any = 'Add';
  action: any = 'Add';

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<DepartmentsNewComponent>
  ) {}

  ngOnInit(): void {
    this.departmentForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      office: [
        null,
        Validators.required,
        ,
        Validators.pattern(GlobalConstant.nameRegex),
      ],
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.departmentForm.patchValue(this.dialogData.data);
      this.offices = this.dialogData.data.offices || [];
    }
  }

  addOffices(): void {
    const office = this.departmentForm.get('office')?.value;
    if (office && !this.offices.includes(office)) {
      this.offices.push(office);
      this.departmentForm.get('office')?.reset();
    }
  }

  removeOffices(index: number): void {
    this.offices.splice(index, 1);
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
      offices: this.offices,
    };
    this.departmentService.addDepartment(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddDepartment.emit();
        this.responseMessage = response?.message;
        this.toastr.success('Department added successfully');
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.info(this.responseMessage, GlobalConstant.error);
      }
    );
  }

  edit() {
    var formData = this.departmentForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      offices: this.offices,
    };
    this.departmentService.updateDepartment(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddDepartment.emit();
        this.responseMessage = response?.message;
        this.toastr.success('Department Updated successfully');
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.info(this.responseMessage, GlobalConstant.error);
      }
    );
  }
}
