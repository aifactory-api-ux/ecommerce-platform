import pytest
from backend.product_service.crud import create_product, update_product, delete_product, ProductNotFoundError

def test_create_product_success():
    from backend.product_service.db import Product
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from backend.shared.db import Base
    
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    product = create_product(session, 'CRUD Product', 'CRUD test', 12.5, 3)
    
    assert product.id is not None
    assert product.name == 'CRUD Product'
    assert product.description == 'CRUD test'
    assert float(product.price) == 12.5
    assert product.stock == 3

def test_update_product_not_found():
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from backend.shared.db import Base
    
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    with pytest.raises(ProductNotFoundError):
        update_product(session, 9999, 'Updated', 'Updated', 1.0, 1)

def test_delete_product_success():
    from backend.product_service.db import Product
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from backend.shared.db import Base
    
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    product = create_product(session, 'To Delete', 'Delete me', 2.0, 1)
    delete_product(session, product.id)
    
    remaining = session.query(Product).filter_by(id=product.id).first()
    assert remaining is None