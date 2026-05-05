from sqlalchemy.orm import Session
from backend.order-service.db import Order, OrderItem
from backend.order-service.models import OrderCreateRequest, OrderItemResponse
import redis
import json

redis_client = redis.Redis(host="redis", port=6379, decode_responses=True)

def add_item_to_cart(user_id: int, product_id: int, quantity: int) -> dict:
    if quantity < 0:
        raise ValueError("Quantity must be positive")
    cart_key = f"cart:{user_id}"
    cart_data = redis_client.get(cart_key)
    cart = json.loads(cart_data) if cart_data else []
    for item in cart:
        if item["product_id"] == product_id:
            item["quantity"] = quantity
            break
    else:
        cart.append({"product_id": product_id, "quantity": quantity})
    redis_client.set(cart_key, json.dumps(cart))
    return {"items": cart}

def get_cart(user_id: int) -> list:
    cart_key = f"cart:{user_id}"
    cart_data = redis_client.get(cart_key)
    return json.loads(cart_data) if cart_data else []

def clear_cart(user_id: int):
    cart_key = f"cart:{user_id}"
    redis_client.delete(cart_key)

def create_order(db: Session, user_id: int, items: list, total: float) -> Order:
    order = Order(user_id=user_id, total=total, status="pending")
    db.add(order)
    db.commit()
    db.refresh(order)
    for item in items:
        order_item = OrderItem(order_id=order.id, product_id=item["product_id"], quantity=item["quantity"], price=item["price"])
        db.add(order_item)
    db.commit()
    return order

def get_orders(db: Session, user_id: int = None):
    query = db.query(Order)
    if user_id:
        query = query.filter(Order.user_id == user_id)
    return query.all()

def get_order_by_id(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def update_order_status(db: Session, order_id: int, status: str) -> Order:
    order = get_order_by_id(db, order_id)
    if order:
        order.status = status
        db.commit()
        db.refresh(order)
    return order