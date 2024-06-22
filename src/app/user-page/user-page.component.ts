import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Assign } from '../_model/assign_model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../_services/product.service';
import { GlobalConstant } from '../_constants/global-constant';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { Product } from '../_model/product_model';
import { ConfirmationComponent } from '../components/extra/confirmation/confirmation.component';
import { ChangePasswordComponent } from '../components/extra/change-password/change-password.component';
import { QrCodeComponent } from '../components/extra/qr-code/qr-code.component';
import { QrcodeService } from '../_services/qrcode.service';
import { RequestAssetComponent } from '../components/request-asset/request-asset.component';
import { MyRequestComponent } from '../components/my-request/my-request.component';
import Swal from 'sweetalert2';
import { UserService } from '../_services/user.service';
import { User } from '../_model/users_model';
import { TextMessageComponent } from '../components/extra/text-message/text-message.component';
import { ToastrService } from 'ngx-toastr';
import { ProfileComponent } from '../components/extra/profile/profile.component';
import { UserProfileComponent } from '../components/extra/user-profile/user-profile.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent implements OnInit {
  @ViewChild('offcanvasBody', { read: ViewContainerRef })
  offcanvasBody!: ViewContainerRef;

  isIconBlinking: boolean = false;

  productDetails: Product[] = [];

  loggedUser: User | null = null;

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
    private ngxService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private router: Router,
    private qrcodeService: QrcodeService,
    private userService: UserService,
    private toastr: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.getAllAssign();
    this.getCurrentUser();
    // this.getAllProduct();
  }

  public getAllAssign() {
    this.productService.getAllAssign().subscribe(
      (response: Assign[]) => {
        // console.log(response);
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
        this.toastr.info(this.responseMessage, GlobalConstant.error);
      }
    );
  }

  //Getting the Current Logged user
  public getCurrentUser() {
    this.userService.getCurrentUser().subscribe((response) => {
      if (Array.isArray(response)) {
        this.loggedUser = response[0];
      } else {
        this.loggedUser = response;
      }
      console.log('Logged User!');
    });
  }

  openReturnAssetDialog(productId: number, userName: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to return the Asset?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      width: 400,
      confirmButtonText: 'Yes, Return it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.unAssignProduct(productId, userName);
        Swal.fire(
          'Returned!',
          `Asset has been returned successfully.`,
          'success'
        );
      }
    });
  }

  unAssignProduct(productId: number, userName: string) {
    this.productService.unAssignUserProduct(productId, userName).subscribe(
      (response: any) => {
        this.getAllAssign();
        this.ngxService.start();
        this.responseMessage = response?.message;
        this.toastr.success('Asset returned successfully!');
        // console.log(response);
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

  // This if for opening chat in new window
  fetchData() {
    window.open('http://localhost:8080/', '_blank');
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

  public logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout',
      confirmation: true,
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitterStatusChange.subscribe(
      (response) => {
        dialogRef.close();
        this.userAuthService.clear();
        this.toastr.success('You have logout in your account! Welcome to SAMS');
        this.router.navigate(['/']);
      }
    );
  }

  handleChangePasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }

  requestAsset() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(RequestAssetComponent, dialogConfig);
  }

  openMyRequest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '750px';
    dialogConfig.position = { top: '50px' };
    this.dialog.open(MyRequestComponent, dialogConfig);
  }

  openTextComponent() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        TextMessageComponent
      );
    this.offcanvasBody.clear();
    this.offcanvasBody.createComponent(componentFactory);
  }

  openProfile() {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
    this.offcanvasBody.clear();
    this.offcanvasBody.createComponent(componentFactory);
  }
}
