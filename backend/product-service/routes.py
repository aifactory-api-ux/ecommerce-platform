from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.product-service.models import ProductCreateRequest, ProductResponse, ProductListResponse
from backend.product-service.crud import create_product, get_products, get_product_by_id, update_product, soft_delete_product
from backend.product-service.dependencies import get_db, admin_role

router = APIRouter()

@router.post("", response_model=ProductResponse)
def create_product_endpoint(product_data: ProductCreateRequest, db: Session = Depends(get_db), user = Depends(admin_role)):
    product = create_product(db, product_data)
    return ProductResponse(id=product.id, name=product.name, description=product.description, price=product.price, stock=product.stock)

@router.get("", response_model=ProductListResponse)
def list_products(db: Session = Depends(get_db)):
    products = get_products(db)
    return ProductListResponse(products=[ProductResponse(id=p.id, name=p.name, description=p.description, price=p.price, stock=p.stock) for p in products])

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductResponse(id=product.id, name=product.name, description=product.description, price=product.price, stock=product.stock)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product_endpoint(product_id: int, product_data: ProductCreateRequest, db: Session = Depends(get_db), user = Depends(admin_role)):
    product = update_product(db, product_id, product_data)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductResponse(id=product.id, name=product.name, description=product.description, price=product.price, stock=product.stock)

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), user = Depends(admin_role)):
    product = soft_delete_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"detail": "Product deleted"}