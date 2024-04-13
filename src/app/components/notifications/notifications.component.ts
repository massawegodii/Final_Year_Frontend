import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../_services/product.service';
import { SnackbarService } from '../../_services/snackbar.service';
import { Request } from '../../_model/request-asset';
import { GlobalConstant } from '../../_constants/global-constant';
import Swal from 'sweetalert2';
import { DeleteStatusComponent } from '../extra/delete-status/delete-status.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  responseMessage: any;
  myRequests: Request[] = [];

  constructor(
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.getAllRequest();
  }

  getAllRequest() {
    this.productService.getAllRequest().subscribe(
      (response: any) => {
        this.myRequests = response;
        this.ngxService.stop();
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

  formatDateString(dateString: string): string {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }

  changeRequestStatus(id: number, status: string) {
    this.productService.changeRequestStatus(id, status).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.getAllRequest();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
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
  


  

  deleteRequest(id: number) {
    const dialogRef = this.dialog.open(DeleteStatusComponent, {
      width: '380px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteRequest(id).subscribe(
          (res) => {
            this.getAllRequest();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }
  
  
  
}
