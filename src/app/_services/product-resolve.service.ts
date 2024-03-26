import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Product } from '../_model/product_model';
import { Observable, map, of } from 'rxjs';
import { ProductService } from './product.service';
import { ImageProcessingService } from './image-processing.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolveService implements Resolve<Product>{
  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product> {
    const id = route.paramMap.get("productId");

    if (id) {
      //then we have to fetch details from backend
       return this.productService.updateAssets(id)
              .pipe(
                map((products: Product[]) => {
                  const product = products[0]; // Assuming you only need the first product
                  return this.imageProcessingService.createImages(product);
                })
              );
    } else {
      // return empty product observable.
      return of(this.getProductDetails());
    }
  }

  getProductDetails() {
    return {
      productId: null,
      productName: '',
      productDescription: '',
      productPrice: 0,
      productModel: '',
      productSerialNo: 0,
      productImages: [],
    };
  }
}
