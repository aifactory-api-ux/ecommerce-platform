export interface OrderItemRequest {
  product_id: number;
  quantity: number;
}

export interface OrderCreateRequest {
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  user_id: number;
  items: OrderItemResponse[];
  total: number;
  status: string;
}

export interface OrderListResponse {
  orders: OrderResponse[];
}