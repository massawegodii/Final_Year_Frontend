import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from '../../_services/product.service';
import { SnackbarService } from '../../_services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Product } from '../../_model/product_model';
import { GlobalConstant } from '../../_constants/global-constant';
import { MatSelectChange } from '@angular/material/select';
import { Category } from '../../_model/category-model';
import { Department } from '../../_model/department-model';
import { Status } from '../../_model/status_model';
import { CategoryService } from '../../_services/category.service';
import { DepartmentService } from '../../_services/department.service';
import { StatusService } from '../../_services/status.service';

@Component({
  selector: 'app-asset-edit',
  templateUrl: './asset-edit.component.html',
  styleUrls: ['./asset-edit.component.scss'],
})
export class AssetEditComponent implements OnInit {
  productForm!: FormGroup;
  responseMessage: any;
  selectedUser: Product | null = null;
  statuses: Status[] = [];
  categories: Category[] = [];
  departments: Department[] = [];
  selectedStatus: string = '';
  selectedCategory: string = '';
  selectedDepartment: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public productServices: ProductService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private statusService: StatusService,
    private categoryService: CategoryService,
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<AssetEditComponent>
  ) {}

  product: Product = {
    productId: null,
    productName: '',
    productDescription: '',
    productPrice: 0,
    productModel: '',
    productSerialNo: 0,
    productStatus: '',
    productDepartment: '',
    productCategory: '',
    qrCode: '',
    productImages: [],

    user: {
      userName: ''
    }
  };

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productId: [null], // This will be populated dynamically
      productName: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      productDescription: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      productPrice: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.number)],
      ],
      productModel: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      productSerialNo: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.number)],
      ],
      qrCode: [null],
      productImages: [null],
      productStatus: [this.product.productStatus, Validators.required], 
      productCategory: [this.product.productCategory, Validators.required], 
      productDepartment: [this.product.productDepartment, Validators.required],

      user: this.formBuilder.group({
        userName: [this.product.user.userName, Validators.required],
      }),
    });

    if (this.data && this.data.product) {
      // If product data exists, populate the form
      const product = this.data.product;
      this.product = {
        productId: product.productId,
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.productPrice,
        productModel: product.productModel,
        productSerialNo: product.productSerialNo,
        productStatus: product.productStatus,
        productCategory: product.productCategory,
        productDepartment: product.productDepartment,
        productImages: product.productImages,
        qrCode: product.qrCode,

        user: {
          userName: product.user.userName
        }
      };
      // Patch the form values
      this.productForm.patchValue({
        productId: this.product.productId,
        productName: this.product.productName,
        productDescription: this.product.productDescription,
        productPrice: this.product.productPrice,
        productModel: this.product.productModel,
        productSerialNo: this.product.productSerialNo,
        productStatus: this.product.productStatus,
        productCategory: this.product.productCategory,
        productDepartment: this.product.productDepartment,

        user: {
          userName: this.product.user.userName
        },
      });
    }
    this.getAllStatus();
    this.getAllCategory();
    this.getAllDepartment();
  }

  handleSubmit() {
    this.ngxService.start();
    const formData = this.productForm.value;

    this.productServices.updateAssets(formData).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
        this.dialogRef.close();
        this.router.navigate(['/dashboard/assets']);
        window.location.reload();
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

  public getAllStatus() {
    this.statusService.getAllStatus().subscribe(
      (response: Status[]) => {
        this.statuses = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Method to handle status selection
  onStatusSelect(event: MatSelectChange) {
    this.selectedStatus = event.value;
  }

  public getAllCategory() {
    this.categoryService.getAllCategory().subscribe(
      (response: Category[]) => {
        this.categories = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Method to handle category selection
  onCategorySelect(event: MatSelectChange) {
    this.selectedCategory = event.value;
  }

  public getAllDepartment() {
    this.departmentService.getAllDepartment().subscribe(
      (response: Department[]) => {
        this.departments = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Method to handle department selection
  onDepartmentSelect(event: MatSelectChange) {
    this.selectedDepartment = event.value;
  }
}