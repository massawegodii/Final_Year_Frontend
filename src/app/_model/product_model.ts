import { FileHandle } from "./file-handle";


export interface Product {
  productId: number | null;
  productName: string;
  productDescription: string;
  productPrice: number;
  productModel: string;
  productSerialNo: number;
  productStatus: string,
  productCategory:string,
  productDepartment: string,
  productImages: FileHandle[],
  user: {
    userName: string
}
}

