from pydantic import BaseModel, condecimal
from typing import List

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
    status: str
    total: float
    items: List[OrderItemResponse]

class OrderListResponse(BaseModel):
    orders: List[OrderResponse]