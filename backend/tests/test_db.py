import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.shared.db import Base
from backend.product_service.db import Product

@pytest.fixture
def engine():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    return engine

@pytest.fixture
def session(engine):
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_product_model_persistence(session):
    product = Product(name='DB Product', description='Persisted product', price=9.99, stock=5)
    session.add(product)
    session.commit()
    retrieved = session.query(Product).filter_by(name='DB Product').first()
    assert retrieved is not None
    assert retrieved.name == 'DB Product'
    assert retrieved.description == 'Persisted product'
    assert float(retrieved.price) == 9.99
    assert retrieved.stock == 5

def test_product_model_negative_stock(session):
    product = Product(name='Negative Stock', description='Invalid stock', price=5.0, stock=-1)
    session.add(product)
    with pytest.raises(Exception):
        session.commit()

def test_product_model_large_price(session):
    product = Product(name='Expensive Product', description='High price', price=99999999.99, stock=1)
    session.add(product)
    session.commit()
    retrieved = session.query(Product).filter_by(name='Expensive Product').first()
    assert retrieved is not None
    assert float(retrieved.price) == 99999999.99