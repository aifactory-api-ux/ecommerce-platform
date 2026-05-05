from pydantic import BaseModel
from typing import Literal

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
    products: list[ProductResponse]