from pydantic import BaseModel, EmailStr
from typing import Literal, List

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserRegisterResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: Literal["customer", "admin"]

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"]

class TokenRefreshRequest(BaseModel):
    refresh_token: str

class TokenRefreshResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"]

class UserProfileResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: Literal["customer", "admin"]

class ProductCreateRequest(BaseModel):
    name: str
    description: str
    price: float
    stock: int

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    stock: int

class ProductListResponse(BaseModel):
    products: List[ProductResponse]

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