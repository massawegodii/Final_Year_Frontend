import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AssetsNewComponent } from '../assets-new/assets-new.component';
import { ProductService } from '../../_services/product.service';
import { Product } from '../../_model/product_model';
import { GlobalConstant } from '../../_constants/global-constant';
import { HttpErrorResponse } from '@angular/common/http';
import { ShowImageDialogComponent } from '../show-image-dialog/show-image-dialog.component';
import { ImageProcessingService } from '../../_services/image-processing.service';
import { map } from 'rxjs';
import { AssetEditComponent } from '../asset-edit/asset-edit.component';
import { StatusService } from '../../_services/status.service';
import { Status } from '../../_model/status_model';
import { CategoryService } from '../../_services/category.service';
import { Category } from '../../_model/category-model';
import { Department } from '../../_model/department-model';
import { DepartmentService } from '../../_services/department.service';
import { ShareComponent } from '../extra/share/share.component';
import { DeleteAssetComponent } from '../extra/delete-asset/delete-asset.component';
import { QrCodeComponent } from '../extra/qr-code/qr-code.component';
import { QrcodeService } from '../../_services/qrcode.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../_services/loading.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
})
export class AssetsComponent implements OnInit {
  responseMessage: any;
  filteredProducts: Product[] = [];
  productDetails: Product[] = [];
  p: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 50;
  isLoading = false;
  allAssets: string = 'all';

  // Pass to get userName
  selectedUserName: string = '';

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
    'Name Assigned',
    'Actions',
  ];

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private statusService: StatusService,
    private categoryService: CategoryService,
    private departmentService: DepartmentService,
    private qrcodeService: QrcodeService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private toastrServices: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllProduct();
    this.getAllStatus();
    this.getAllCategory();
    this.getAllDepartment();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  goToPreviousPage(): void {
    if (this.p > 1) {
      this.p--;
    }
  }

  goToNextPage(): void {
    if (this.p < this.totalPages) {
      this.p++;
    }
  }

  key: string = '';
  reverse: boolean = false;
  sort(key: string): void {
    if (this.key === key) {
      this.reverse = !this.reverse;
    } else {
      this.reverse = false;
    }
    this.key = key;
    this.productDetails.sort((a, b) => {
      if (a[key] < b[key]) return this.reverse ? 1 : -1;
      if (a[key] > b[key]) return this.reverse ? -1 : 1;
      return 0;
    });
  }

  handleCreateNewAssetAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '500px';
    dialogConfig.data = {
      refreshProducts: () => this.getAllProduct(),
    };

    this.dialog.open(AssetsNewComponent, dialogConfig);
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
          this.filterProduct();
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

  filterProduct(event?: Event) {
    const filterValue = this.allAssets;

    if (filterValue === 'all') {
      this.filteredProducts = this.productDetails;
    } else if (filterValue === 'assign') {
      this.filteredProducts = this.productDetails.filter(
        (product: Product) => product['userName'] !== 'Not Assigned'
      );
    } else if (filterValue === 'unassign') {
      this.filteredProducts = this.productDetails.filter(
        (product: Product) => product['userName'] === 'Not Assigned'
      );
    }
  }

  //Delete Asset in Admin
  openDeleteAssetDialog(productId: any): void {
    const dialogRef = this.dialog.open(DeleteAssetComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProduct(productId);
      }
    });
  }

  public deleteProduct(productId: any) {
    this.productService.deleteProductDetails(productId).subscribe(
      (response) => {
        this.getAllProduct();
        this.toastrServices.success('Asset Deleted Successfully!');
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  showImage(product: Product) {
    console.log(product);
    this.dialog.open(ShowImageDialogComponent, {
      data: {
        image: product.productImages,
      },
      height: '400px',
      width: '600px',
    });
  }

  showQrCode(product: Product) {
    if (product.productId !== null && product.productId !== undefined) {
      this.qrcodeService
        .generateQRCode(product.productId)
        .subscribe((blob: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            if (reader.result !== null) {
              const base64data = reader.result.toString();
              this.dialog.open(QrCodeComponent, {
                data: {
                  image: base64data,
                },
                height: '230px',
                width: '200px',
              });
            } else {
              console.error('Reader result is null.');
            }
          };
        });
    } else {
      console.error('Asset ID is null or undefined.');
    }
  }

  editProductDetails(productId: any) {
    const product = this.productDetails.find((p) => p.productId === productId);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.data = {
      product: product,
      refreshProducts: () => this.getAllProduct(),
    };

    this.dialog.open(AssetEditComponent, dialogConfig);
  }

  shareProductToUser(productId: any) {
    const product = this.productDetails.find((p) => p.productId === productId);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.data = {
      product: product,
      refreshProducts: () => this.getAllProduct(),
    };
    this.dialog.open(ShareComponent, dialogConfig);
  }

  applFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim();
    this.filteredProducts = this.productDetails.filter(
      (product: Product) =>
        product.productName.toLowerCase().includes(filterValue) ||
        product.productDescription.toLowerCase().includes(filterValue) ||
        product.productModel.toLowerCase().includes(filterValue) ||
        product.productSerialNo
          .toString()
          .toLowerCase()
          .includes(filterValue) ||
        product.productPrice.toString().toLowerCase().includes(filterValue) ||
        product.productStatus.toString().toLowerCase().includes(filterValue) ||
        product.productCategory
          .toString()
          .toLowerCase()
          .includes(filterValue) ||
        product.productDepartment.toString().toLowerCase().includes(filterValue)
    );
  }
}
