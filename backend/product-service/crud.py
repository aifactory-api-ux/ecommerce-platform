from sqlalchemy.orm import Session
from .db import Product
from typing import Optional, List

class ProductNotFoundError(Exception):
    pass

def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[Product]:
    return db.query(Product).offset(skip).limit(limit).all()

def create_product(db: Session, name: str, description: str, price: float, stock: int) -> Product:
    product = Product(name=name, description=description, price=price, stock=stock)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def update_product(db: Session, product_id: int, name: str, description: str, price: float, stock: int) -> Product:
    product = get_product_by_id(db, product_id)
    if not product:
        raise ProductNotFoundError(f"Product {product_id} not found")
    
    product.name = name
    product.description = description
    product.price = price
    product.stock = stock
    db.commit()
    db.refresh(product)
    return product

def delete_product(db: Session, product_id: int) -> None:
    product = get_product_by_id(db, product_id)
    if not product:
        raise ProductNotFoundError(f"Product {product_id} not found")
    
    db.delete(product)
    db.commit()