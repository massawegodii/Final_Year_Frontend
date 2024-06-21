import { Component, OnInit } from '@angular/core';
import { Product } from '../../../_model/product_model';
import { CategoryService } from '../../../_services/category.service';
import { DepartmentService } from '../../../_services/department.service';
import { ProductService } from '../../../_services/product.service';
import { StatusService } from '../../../_services/status.service';
import { map } from 'rxjs';
import { GlobalConstant } from '../../../_constants/global-constant';
import { Category } from '../../../_model/category-model';
import { Department } from '../../../_model/department-model';
import { Status } from '../../../_model/status_model';
import { ImageProcessingService } from '../../../_services/image-processing.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../_services/loading.service';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrl: './general-report.component.scss',
})
export class GeneralReportComponent implements OnInit {
  responseMessage: any;
  isLoading = false;
  displayedColumns: string[] = [
    'Id',
    'Product Name',
    'Product Description',
    'Product Price',
    'Product Model',
    'Product Status',
    'Product Category',
    'Asset Type',
    'Product Serial Number',
    'Product Department',
    'Date Assigned',
  ];

  productDetails: Product[] = [];
  constructor(
    private productService: ProductService,
    private statusService: StatusService,
    private categoryService: CategoryService,
    private imageProcessingService: ImageProcessingService,
    private departmentService: DepartmentService,
    private toastr: ToastrService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getAllProduct();
    this.getAllStatus();
    this.getAllCategory();
    this.getAllDepartment();
  }

  // Calling the Select data
  statuses: Status[] = [];
  getStatusName(productStatus: string): string {
    if (!productStatus) {
      return 'No Status';
    }

    const status = this.statuses.find((s) => s.name === productStatus);
    return status ? status.name : 'No Status';
  }

  categories: Category[] = [];
  getCategoryName(productCategory: string): string {
    if (!productCategory) {
      return 'No Category';
    }

    const category = this.categories.find((c) => c.name === productCategory);
    return category ? category.name : 'No Category';
  }

  products: Product[] = [];
  getProductType(productType: string): string {
    if (!productType) {
      return 'No Asset Type';
    }

    const assetType = this.products.find((p) => p.productType === productType);
    console.log(assetType);
    return assetType ? assetType.productType : 'No Asset Type';
  }

  departments: Department[] = [];
  getDepartmentName(productDepartment: string): string {
    if (!productDepartment) {
      return 'No Department';
    }

    const department = this.departments.find(
      (d) => d.name === productDepartment
    );
    return department ? department.name : 'No Department';
  }

  public getAllDepartment() {
    this.departmentService.getAllDepartment().subscribe(
      (response: Department[]) => {
        this.departments = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public getAllCategory() {
    this.categoryService.getAllCategory().subscribe(
      (response: Category[]) => {
        this.categories = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public getAllStatus() {
    this.statusService.getAllStatus().subscribe(
      (response: Status[]) => {
        this.statuses = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public getAllProduct() {
    this.isLoading = true;
    this.productService
      .getAllProduct()
      .pipe(
        map(
          (x: Product[], i) =>
            x.map((product: Product) =>
              this.imageProcessingService.createImages(product)
            ),
          this.loadingService.simulateLoading
        )
      )
      .subscribe(
        (response: Product[]) => {
          this.productDetails = response;
          this.products = response;
          this.isLoading = false;

          // Assigning the userName
          this.productDetails = response.map((product) => {
            return {
              ...product,
              userName: product.user?.userName || 'Not Assigned',
            };
          });
        },
        (error) => {
          if (error.error?.message) {
            this.isLoading = false;
            this.responseMessage = error.error?.message;
          } else {
            this.responseMessage = GlobalConstant.genericError;
          }
          this.toastr.warning(this.responseMessage, GlobalConstant.error);
        }
      );
  }
}
