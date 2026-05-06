from pydantic import BaseModel, condecimal
from typing import List

class ProductCreateRequest(BaseModel):
    name: str
    description: str
    price: condecimal(max_digits=10, decimal_places=2)
    stock: int

class ProductUpdateRequest(BaseModel):
    name: str
    description: str
    price: condecimal(max_digits=10, decimal_places=2)
    stock: int

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    stock: int

class ProductListResponse(BaseModel):
    products: List[ProductResponse]