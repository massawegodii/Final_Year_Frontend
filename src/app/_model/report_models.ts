export interface Report {
    name: string;
    contactNumber: string;
    email: string;
    productDetails: ProductDetail[];
    uuid: string;
  }
  
  export interface ProductDetail {
    productName: string;
    productDepartment: string;
    productCategory: string;
    productSerialNo: string;
    productStatus: string;
    productPrice: string;
  }
  