from sqlalchemy.orm import Session
from backend.product_service.db import Product, Category
from backend.product_service.models import ProductCreateRequest

def create_product(db: Session, product_data: ProductCreateRequest, category_id: int = None) -> Product:
    product = Product(
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        stock=product_data.stock,
        category_id=category_id
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).filter(Product.deleted == False).offset(skip).limit(limit).all()

def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id, Product.deleted == False).first()

def update_product(db: Session, product_id: int, product_data: ProductCreateRequest) -> Product:
    product = get_product_by_id(db, product_id)
    if product:
        product.name = product_data.name
        product.description = product_data.description
        product.price = product_data.price
        product.stock = product_data.stock
        db.commit()
        db.refresh(product)
    return product

def soft_delete_product(db: Session, product_id: int) -> Product:
    product = get_product_by_id(db, product_id)
    if product:
        product.deleted = True
        db.commit()
        db.refresh(product)
    return product