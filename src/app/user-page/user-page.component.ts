import { Component, OnInit } from '@angular/core';
import { Assign } from '../_model/assign_model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ImageProcessingService } from '../_services/image-processing.service';
import { ProductService } from '../_services/product.service';
import { SnackbarService } from '../_services/snackbar.service';
import { GlobalConstant } from '../_constants/global-constant';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { ReturnAssetComponent } from '../components/extra/return-asset/return-asset.component';
import { Product } from '../_model/product_model';
import { ConfirmationComponent } from '../components/extra/confirmation/confirmation.component';
import { ChangePasswordComponent } from '../components/extra/change-password/change-password.component';
import { QrCodeComponent } from '../components/extra/qr-code/qr-code.component';
import { QrcodeService } from '../_services/qrcode.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent implements OnInit {

  isIconBlinking: boolean = false;
  
  productDetails: Product[] = [];

  responseMessage: any;
  filteredProducts: Assign[] = [];
  assignDetails: Assign[] = [];
  displayedColumns: string[] = [
    'Product Name',
    'Product Description',
    'Product Price',
    'Product Model',
    'Product Serial Number',
    'Date Assigned',
    'Actions',
  ];
  

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private router: Router,
    private qrcodeService: QrcodeService,
    private imageProcessingService: ImageProcessingService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.getAllAssign();
    // this.getAllProduct();
  }

  public getAllAssign() {
    this.productService.getAllAssign().subscribe(
      (response: Assign[]) => {
        console.log(response);
        this.assignDetails = response;
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

  openReturnAssetDialog(productId: number, userName: string): void {
    const dialogRef = this.dialog.open(ReturnAssetComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.unAssignProduct(productId, userName);
      }
    });
  }

  unAssignProduct(productId: number, userName: string) {
    this.productService.unAssignUserProduct(productId, userName).subscribe(
      (response: any) => {
        this.getAllAssign();
        this.ngxService.start();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
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


// This if for opening chat in new window
  fetchData() {
    window.open('http://localhost:8080/', '_blank');
  }

  
  showQrCode(product: Product) {
    if (product.productId !== null && product.productId !== undefined) {
      this.qrcodeService.generateQRCode(product.productId)
        .subscribe((blob: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            if (reader.result !== null) {
              const base64data = reader.result.toString();
              this.dialog.open(QrCodeComponent, {
                data: {
                  image: base64data
                },
                height: '230px',
                width: '200px'
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


  public logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout',
      confirmation: true
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitterStatusChange.subscribe((response) => {
      dialogRef.close();
      this.userAuthService.clear();
      this.router.navigate(['/']);
    });
  }

  
  handleChangePasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }
}
