import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.shared.db import Base
from backend.order_service.db import Order, OrderItem

def test_order_and_orderitem_models_create_and_query():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    order = Order(user_id=1, status='pending')
    session.add(order)
    session.commit()
    order_item = OrderItem(order_id=order.id, product_id=1, quantity=2, price=10.0)
    session.add(order_item)
    session.commit()
    assert order.id == 1
    assert order_item.quantity == 2
    session.close()

def test_order_model_requires_user_id():
    from sqlalchemy.exc import IntegrityError
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    with pytest.raises(IntegrityError):
        order = Order(status='pending')
        session.add(order)
        session.commit()
    session.close()

def test_orderitem_model_quantity_must_be_positive():
    from sqlalchemy.exc import IntegrityError
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    order = Order(user_id=1, status='pending')
    session.add(order)
    session.commit()
    with pytest.raises(IntegrityError):
        item = OrderItem(order_id=order.id, product_id=1, quantity=0, price=10.0)
        session.add(item)
        session.commit()
    session.close()