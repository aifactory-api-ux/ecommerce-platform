import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.shared.db import Base

def test_category_model_persistence():
    from sqlalchemy import Column, Integer, String
    class Category(Base):
        __tablename__ = 'categories'
        id = Column(Integer, primary_key=True, index=True)
        name = Column(String, nullable=False)

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
    from sqlalchemy import Column, Integer, String, ForeignKey
    from sqlalchemy.orm import relationship
    class Category(Base):
        __tablename__ = 'categories'
        id = Column(Integer, primary_key=True, index=True)
        name = Column(String, nullable=False)
    class Product(Base):
        __tablename__ = 'products'
        id = Column(Integer, primary_key=True, index=True)
        name = Column(String, nullable=False)
        category_id = Column(Integer, ForeignKey('categories.id'))

    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    cat = Category(name='Books')
    session.add(cat)
    session.commit()
    product = Product(name='Book 1', category_id=cat.id)
    session.add(product)
    session.commit()
    assert product.category_id == cat.id
    session.close()

def test_review_model_invalid_product_id_raises():
    from sqlalchemy import Column, Integer, String, ForeignKey
    from sqlalchemy.exc import IntegrityError
    class Review(Base):
        __tablename__ = 'reviews'
        id = Column(Integer, primary_key=True, index=True)
        product_id = Column(Integer, ForeignKey('products.id'))
        user_id = Column(Integer, nullable=False)
        rating = Column(Integer, nullable=False)
        comment = Column(String)

    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    with pytest.raises(IntegrityError):
        review = Review(product_id=999, user_id=1, rating=5, comment='Great!')
        session.add(review)
        session.commit()
    session.close()