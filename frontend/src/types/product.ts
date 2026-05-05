export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductListResponse {
  products: ProductResponse[];
}