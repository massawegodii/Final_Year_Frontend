import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstant } from '../../_constants/global-constant';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Department } from '../../_model/department-model';
import { DepartmentService } from '../../_services/department.service';
import { SnackbarService } from '../../_services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-request-asset',
  templateUrl: './request-asset.component.html',
  styleUrl: './request-asset.component.scss',
})
export class RequestAssetComponent implements OnInit {
  responseMessage: any;
  requestForm: any = FormGroup;
  departments: Department[] = [];
  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private departmentService: DepartmentService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<RequestAssetComponent>
  ) {}

  
  ngOnInit(): void {
    this.requestForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      department: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      numberOfAsset: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.number)],
      ],
      startDate: new FormControl(new Date(year, month, 13), Validators.required),
      endDate: new FormControl(new Date(year, month, 16), Validators.required),
    });
    this.getAllDepartment();
  }

  public handleSubmitRequest() {
    var formData = this.requestForm.value;
    var data = {
      name: formData.name,
      department: formData.department,
      numberOfAsset: formData.numberOfAsset,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };
    this.productService.requestAssets(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
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
    });
  }

  public getAllDepartment() {
    this.departmentService.getAllDepartment().subscribe(
      (response: Department[]) => {
        this.departments = response;
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
}
