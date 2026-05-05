from pydantic import BaseModel
from typing import List, Literal

class OrderItemRequest(BaseModel):
    product_id: int
    quantity: int

class OrderCreateRequest(BaseModel):
    items: List[OrderItemRequest]

class OrderItemResponse(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int

class OrderResponse(BaseModel):
    id: int
    user_id: int
    items: List[OrderItemResponse]
    total: float
    status: str

class OrderListResponse(BaseModel):
    orders: List[OrderResponse]