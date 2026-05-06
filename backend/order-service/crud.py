from sqlalchemy.orm import Session
from .db import Order
from typing import Optional, List
import json

class OrderNotFoundError(Exception):
    pass

def get_order_by_id(db: Session, order_id: int) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()

def get_orders_by_user_id(db: Session, user_id: int) -> List[Order]:
    return db.query(Order).filter(Order.user_id == user_id).all()

def get_all_orders(db: Session) -> List[Order]:
    return db.query(Order).all()

def create_order(db: Session, user_id: int, items: List[dict], total: float) -> Order:
    order = Order(user_id=user_id, items=items, total=total, status="pending")
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

def update_order_status(db: Session, order_id: int, status: str) -> Order:
    order = get_order_by_id(db, order_id)
    if not order:
        raise OrderNotFoundError(f"Order {order_id} not found")
    
    order.status = status
    db.commit()
    db.refresh(order)
    return order