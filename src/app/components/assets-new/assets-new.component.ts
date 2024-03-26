import { Component, Inject, OnInit } from '@angular/core';
import { Product } from '../../_model/product_model';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../_services/product.service';
import { SnackbarService } from '../../_services/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from '../../_constants/global-constant';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../../_model/file-handle';
import { Status } from '../../_model/status_model';
import { MatSelectChange } from '@angular/material/select';
import { StatusService } from '../../_services/status.service';
import { CategoryService } from '../../_services/category.service';
import { DepartmentService } from '../../_services/department.service';
import { Category } from '../../_model/category-model';
import { Department } from '../../_model/department-model';

@Component({
  selector: 'app-assets-new',
  templateUrl: './assets-new.component.html',
  styleUrl: './assets-new.component.scss',
})
export class AssetsNewComponent implements OnInit {
  productForm: any = NgForm;
  responseMessage: any;
  statuses: Status[] = []; 
  categories: Category[] = []; 
  departments: Department[] = []; 
  selectedStatus: string = '';
  selectedCategory: string = '';
  selectedDepartment: string = '';

  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private productServices: ProductService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<AssetsNewComponent>,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    private statusService: StatusService,
    private categoryService: CategoryService,
    private departmentService: DepartmentService
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
    productImages: [],

    user: {
      userName: ''
    }
  };

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      
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
      productImages: [null] ,

      user: this.formBuilder.group({
        userName: [null],
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
        productImages: [],

        user: {
          userName: product.user.userName
        }
      };
      // Patch the form values
      this.productForm.patchValue({
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

  addProduct(productForm: NgForm) {
    const formData = this.prepareFormData(this.product);
    this.ngxService.start();

    if (this.data && this.data.product && this.data.product.productId) {
      // If product ID exists, update the product
      this.productServices.updateAssets(formData).subscribe(
        (response: any) => {
          // Handle update success
          this.handleSuccess(response);
        },
        (error) => {
          // Handle update error
          this.handleError(error);
        }
      );
    } else {
      // If no product ID, add a new product
      this.productServices.addProduct(formData).subscribe(
        (response: any) => {
          // Handle add success
          this.handleSuccess(response);
        },
        (error) => {
          // Handle add error
          this.handleError(error);
        }
      );
    }
  }

  private handleSuccess(response: any) {
    this.ngxService.stop();
    this.dialogRef.close(response);
    this.responseMessage = response?.message;
    this.snackbarService.openSnackBar(this.responseMessage, 'success');
    this.router.navigate(['/dashboard/assets']);
    console.log(response);
    this.productForm.reset(response);
    this.product.productImages = [];
    window.location.reload();
  }

  private handleError(error: any) {
    this.ngxService.stop();
    if (error.error?.message) {
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstant.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstant.error);
  }


  prepareFormData(product: Product): FormData {
    const uploadImageData = new FormData();
    uploadImageData.append(
      'product',
      new Blob([JSON.stringify(product)], { type: 'application/json' })
    );

    for (var i = 0; i < this.product.productImages.length; i++) {
      uploadImageData.append(
        'imageFile',
        this.product.productImages[i].file,
        this.product.productImages[i].file.name
      );
    }
    return uploadImageData;
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];

      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        ),
      };
      this.product.productImages.push(fileHandle);
    }
  }

  removeImages(i: number) {
    this.product.productImages.splice(i, 1);
  }

  
  fileDropped(filehandle: FileHandle) {
    this.product.productImages.push(filehandle);
  }

  public getAllStatus() {
    this.statusService.getAllStatus().subscribe((response: Status[]) => {
      this.statuses = response;
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

    // Method to handle status selection
    onStatusSelect(event: MatSelectChange) {
      this.selectedStatus = event.value;
    }



    public getAllCategory() {
      this.categoryService.getAllCategory().subscribe((response: Category[]) => {
        this.categories = response;
        console.log(response);
      }, (error) => {
        console.log(error);
      });
    }
  
      // Method to handle category selection
      onCategorySelect(event: MatSelectChange) {
        this.selectedCategory = event.value;
      }


      public getAllDepartment() {
        this.departmentService.getAllDepartment().subscribe((response: Department[]) => {
          this.departments = response;
          console.log(response);
        }, (error) => {
          console.log(error);
        });
      }
    
        // Method to handle department selection
        onDepartmentSelect(event: MatSelectChange) {
          this.selectedDepartment = event.value;
        }
}