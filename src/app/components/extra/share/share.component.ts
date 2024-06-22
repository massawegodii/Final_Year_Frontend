import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Status } from '../../../_model/status_model';
import { Category } from '../../../_model/category-model';
import { Department } from '../../../_model/department-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoryService } from '../../../_services/category.service';
import { DepartmentService } from '../../../_services/department.service';
import { StatusService } from '../../../_services/status.service';
import { Assign } from './../../../_model/assign_model';
import { GlobalConstant } from '../../../_constants/global-constant';
import { MatSelectChange } from '@angular/material/select';
import { ProductService } from '../../../_services/product.service';
import { User } from '../../../_model/users_model';
import { UserService } from '../../../_services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss',
})
export class ShareComponent implements OnInit {
  assignForm!: FormGroup;
  responseMessage: any;
  selectedUser: Assign | null = null;
  statuses: Status[] = [];
  categories: Category[] = [];
  users: User[] = [];
  departments: Department[] = [];
  selectedStatus: string = '';
  selectedUserName: string = '';
  selectedCategory: string = '';
  selectedDepartment: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private formBuilder: FormBuilder,
    private statusService: StatusService,
    private categoryService: CategoryService,
    private departmentService: DepartmentService,
    private userService: UserService,
    private productService: ProductService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ShareComponent>
  ) {}

  product: Assign = {
    productId: null,
    productName: '',
    productDescription: '',
    productPrice: 0,
    productModel: '',
    productSerialNo: 0,
    productStatus: '',
    productDepartment: '',
    productCategory: '',
    productImages: [],
    userName: '',
  };

  ngOnInit(): void {
    this.assignForm = this.formBuilder.group({
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
      productImages: [null],
      productStatus: [this.product.productStatus, Validators.required],
      userName: [[null], Validators.required],
      productCategory: [this.product.productCategory, Validators.required],
      productDepartment: [this.product.productDepartment, Validators.required],
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
        userName: product.userName,
      };
      // Patch the form values
      this.assignForm.patchValue({
        productId: this.product.productId,
        productName: this.product.productName,
        productDescription: this.product.productDescription,
        productPrice: this.product.productPrice,
        productModel: this.product.productModel,
        productSerialNo: this.product.productSerialNo,
        productStatus: this.product.productStatus,
        productCategory: this.product.productCategory,
        productDepartment: this.product.productDepartment,
        userName: this.product.userName,
      });
    }
    this.getAllStatus();
    this.getAllCategory();
    this.getAllAssignUserName();
    this.getAllDepartment();
  }

  handleSubmit() {
    const formData = this.assignForm.value;

    this.productService.assignToUser(formData).subscribe(
      (response: any) => {
        this.responseMessage = response?.message;
        this.toastr.success('Asset assigned successfully to the user');
        this.dialogRef.close();
        this.router.navigate(['/dashboard/assets']);
        // Call the refresh function passed in the data
        if (this.data && this.data.refreshProducts) {
          this.data.refreshProducts();
        }
      },
      (error) => {
        this.toastr.error();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.error(this.responseMessage, GlobalConstant.error);
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

  // Method to handle userName selection
  onAssignUserNameSelect(event: MatSelectChange) {
    this.selectedUserName = event.value;
  }

  public getAllAssignUserName() {
    this.userService.getAllUsers().subscribe(
      (response: User[]) => {
        this.users = response;
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
