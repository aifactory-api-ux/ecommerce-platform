from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.shared.db import get_db_session
from backend.product_service.models import (
    ProductCreateRequest, ProductUpdateRequest, ProductResponse, ProductListResponse
)
from backend.product_service.crud import (
    get_product_by_id, get_products, create_product, update_product, delete_product,
    ProductNotFoundError
)
from .dependencies import get_current_user, require_role

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=ProductResponse)
def create_product_endpoint(
    request: ProductCreateRequest,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_role("admin"))
):
    product = create_product(
        db,
        name=request.name,
        description=request.description,
        price=float(request.price),
        stock=request.stock
    )
    return ProductResponse(
        id=product.id,
        name=product.name,
        description=product.description,
        price=float(product.price),
        stock=product.stock
    )

@router.get("/", response_model=ProductListResponse)
def list_products(db: Session = Depends(get_db_session)):
    products = get_products(db)
    return ProductListResponse(
        products=[
            ProductResponse(
                id=p.id,
                name=p.name,
                description=p.description,
                price=float(p.price),
                stock=p.stock
            )
            for p in products
        ]
    )

@router.get("/{product_id}", response_model=ProductResponse)
def get_product_endpoint(product_id: int, db: Session = Depends(get_db_session)):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return ProductResponse(
        id=product.id,
        name=product.name,
        description=product.description,
        price=float(product.price),
        stock=product.stock
    )

@router.put("/{product_id}", response_model=ProductResponse)
def update_product_endpoint(
    product_id: int,
    request: ProductUpdateRequest,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_role("admin"))
):
    try:
        product = update_product(
            db,
            product_id=product_id,
            name=request.name,
            description=request.description,
            price=float(request.price),
            stock=request.stock
        )
        return ProductResponse(
            id=product.id,
            name=product.name,
            description=product.description,
            price=float(product.price),
            stock=product.stock
        )
    except ProductNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

@router.delete("/{product_id}")
def delete_product_endpoint(
    product_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_role("admin"))
):
    try:
        delete_product(db, product_id)
        return {"detail": "Product deleted"}
    except ProductNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")