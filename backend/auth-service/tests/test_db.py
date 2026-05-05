import pytest
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.auth_service.db import Base, Category, Product, Review

def test_category_model_persistence():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    category = Category(name='Electronics')
    session.add(category)
    session.commit()
    assert category.id == 1
    assert category.name == 'Electronics'
    session.close()

def test_product_model_foreign_key_category():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    cat = Category(name='Books')
    session.add(cat)
    session.commit()
    product = Product(name='Book 1', description='A book', price=10.0, stock=5, category_id=cat.id)
    session.add(product)
    session.commit()
    assert product.category_id == cat.id
    session.close()

def test_review_model_invalid_product_id_raises():
    from sqlalchemy.exc import IntegrityError
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    with pytest.raises(IntegrityError):
        review = Review(product_id=999, user_id=1, rating=5, comment='Great!')
        session.add(review)
        session.commit()
    session.close()