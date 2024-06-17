import { FileHandle } from "./file-handle";


export interface Product {
  productId: number | null;
  productName: string;
  productDescription: string;
  productPrice: number;
  productModel: string;
  productSerialNo: number;
  productStatus: string;
  productType: string;
  productCategory: string;
  productDepartment: string;
  qrCode: string;
  productImages: FileHandle[];
  user: {
    userName: string;
  };
  [key: string]: any;
}

