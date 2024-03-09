import { Component, OnInit } from '@angular/core';
import { Product } from '../../_model/product_model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../_services/product.service';
import { SnackbarService } from '../../_services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstant } from '../../_constants/global-constant';

@Component({
  selector: 'app-assets-new',
  templateUrl: './assets-new.component.html',
  styleUrl: './assets-new.component.scss',
})
export class AssetsNewComponent implements OnInit {
  addProductForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private router: Router,
    private productServices: ProductService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<AssetsNewComponent>,
    private ngxService: NgxUiLoaderService
  ) {}

  product: Product = {
    productId: null,
    productName: '',
    productDescription: '',
    productPrice: 0,
    productModel: '',
    productSerialNo: 0,
  };

  ngOnInit(): void {
    this.addProductForm = this.formBuilder.group({
      productName:[null, [Validators.required, Validators.pattern(GlobalConstant.nameRegex)]],
      productDescription:[null, [Validators.required, Validators.pattern(GlobalConstant.nameRegex)]],
      productPrice:[null, [Validators.required, Validators.pattern(GlobalConstant.number)]],
      productModel:[null, [Validators.required, Validators.pattern(GlobalConstant.nameRegex)]],
      productSerialNo:[null, [Validators.required, Validators.pattern(GlobalConstant.number)]],
    });
  }
  


  handleAddProductSubmit(){
    this.ngxService.start();
    var product = this.addProductForm.value;
    var data = {
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: product.productPrice,
      productModel: product.productModel,
      productSerialNo: product.productSerialNo,
    }
    this.productServices.addProduct(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.mesage;
      this.snackbarService.openSnackBar(this.responseMessage, "");
      this.router.navigate(['/dashboard/assets'])

    }, (error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstant.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstant.error);
    })
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  }
}
