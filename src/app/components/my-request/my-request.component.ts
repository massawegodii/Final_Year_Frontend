import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { Request } from '../../_model/request-asset';

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrl: './my-request.component.scss'
})
export class MyRequestComponent implements OnInit {
  

  myRequests: Request[] = [];

  constructor(private productService: ProductService,){}

  ngOnInit(): void {
    this.getAllRequest();
  }

  getAllRequest() {
    this.productService.getAllRequestByUsername().subscribe((response: any) => {
      this.myRequests = response;
      console.log(response);
    }, (error) => {
      console.log(error)
    });
  }

}
