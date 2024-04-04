import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../_services/report.service';
import { DepartmentService } from '../../_services/department.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../_services/snackbar.service';
import { CategoryService } from '../../_services/category.service';
import { GlobalConstant } from '../../_constants/global-constant';
import { Category } from '../../_model/category-model';
import { Department } from '../../_model/department-model';
import { saveAs } from 'file-saver';
import { Product } from '../../_model/product_model';
import { ProductService } from '../../_services/product.service';
import { Status } from '../../_model/status_model';
import { StatusService } from '../../_services/status.service';
import { ProductDetail, Report } from '../../_model/report_models';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {

  responseMessage: any;
  productDetails: ProductDetail[] = [];

  displayedColumns: string[] = [
    'Name',
    'Price',
    'SerialNo',
    'Department',
    'Status',
    'Delete',

  ];

  categories: Category[] = [];
  statuses: Status[] = [];
  departments: Department[] = [];
  products: Product[] = [];
  dataSource: any[] = []; 
  manageReportForm: any = FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private snackbarService: SnackbarService,
    private departmentService: DepartmentService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private statusService: StatusService,
    private ngxService: NgxUiLoaderService
  ) {}



  ngOnInit(): void {
    this.manageReportForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      productDepartment: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      contactNumber: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.contactNumberRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.emailRegex)],
      ],
      productPrice: [0, [Validators.required]],
      productSerialNo: [null, [Validators.required]],
      productCategory: [null, Validators.required], 
      productName: [null, Validators.required], 
      productStatus: [null, Validators.required], 
    });
  
    this.ngxService.start();
    this.getAllCategory();
    this.getAllDepartment();
    this.getAllProduct();
    this.getAllStatus();
  }
  
  
  validateSubmit() {
    const controls = this.manageReportForm.controls;
    return Object.keys(controls).some(controlName => controls[controlName].invalid);
  }
  

  add() {
    var formData = this.manageReportForm.value;
    var productDetail: ProductDetail = {
      productName: formData.productName,
      productDepartment: formData.productDepartment,
      productCategory: formData.productCategory,
      productSerialNo: formData.productSerialNo,
      productPrice: formData.productPrice,
      productStatus: formData.productStatus
    };
  
    // Check if product already exists
    const isProductExist = this.productDetails.some((item) => {
      return item.productSerialNo === productDetail.productSerialNo;
    });
  
    if (!isProductExist) {
      this.productDetails.push(productDetail);
  
      // Update dataSource to display in the table
      this.dataSource = [...this.productDetails];
  
      this.snackbarService.openSnackBar('Product added', 'success');
    } else {
      this.snackbarService.openSnackBar(GlobalConstant.productExistError, GlobalConstant.error);
    }
  }
  
  

  handleDeleteAction(value: any, element: any) {
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }


  handleSubmitAction() {
    var formData = this.manageReportForm.value;
  
    var data = {
      name: formData.name,
      contactNumber: formData.contactNumber,
      email: formData.email,
      productDetails: JSON.stringify(this.dataSource)
    };
  
    this.ngxService.start();
    this.reportService.generateReport(data).subscribe(
      (response: any) => {
        this.downloadFile(response?.uuid);
        this.manageReportForm.reset();
        this.productDetails = [];
        this.dataSource = [];
  
        this.snackbarService.openSnackBar('Report generated successfully!', 'success');
      },
      (error) => {
        this.ngxService.stop();
        let errorMessage = 'An error occurred';
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.snackbarService.openSnackBar(errorMessage, 'error');
      }
    );
  }
  
  

  downloadFile(fileName: string) {
    var data = {
      uuid : fileName
    }
    this.reportService.getPdf(data).subscribe((response: any) => {
      saveAs(response, fileName + '.pdf');
      this.ngxService.stop();
    })
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


  public getAllProduct() {
    this.productService.getAllProduct().subscribe(
      (response: Product[]) => {
        console.log(response);
        this.products = response;
        this.ngxService.stop();
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

  
}
