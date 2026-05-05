from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.order-service.models import OrderCreateRequest, OrderResponse, OrderListResponse, OrderItemResponse
from backend.order-service.crud import add_item_to_cart, get_cart, clear_cart, create_order, get_orders, get_order_by_id, update_order_status
from backend.order-service.dependencies import get_db, get_current_user, admin_role

router = APIRouter()

@router.get("/cart")
def get_cart_items(user = Depends(get_current_user)):
    cart = get_cart(user.id)
    return {"items": cart}

@router.post("/cart/items")
def add_cart_item(product_id: int, quantity: int, user = Depends(get_current_user)):
    try:
        cart = add_item_to_cart(user.id, product_id, quantity)
        return cart
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

@router.post("/orders", response_model=OrderResponse)
def create_order_endpoint(order_data: OrderCreateRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    cart = get_cart(user.id)
    if not cart:
        raise HTTPException(status_code=400, detail="Cart is empty")
    total = 0.0
    items_response = []
    for cart_item in cart:
        items_response.append(OrderItemResponse(product_id=cart_item["product_id"], name="Product", price=10.0, quantity=cart_item["quantity"]))
        total += 10.0 * cart_item["quantity"]
    order = create_order(db, user.id, cart, total)
    clear_cart(user.id)
    return OrderResponse(id=order.id, user_id=order.user_id, items=items_response, total=order.total, status=order.status)

@router.get("/orders", response_model=OrderListResponse)
def list_orders(db: Session = Depends(get_db), user = Depends(get_current_user)):
    orders = get_orders(db, user.id if user.role != "admin" else None)
    return OrderListResponse(orders=[OrderResponse(id=o.id, user_id=o.user_id, items=[], total=o.total, status=o.status) for o in orders])

@router.get("/orders/{order_id}", response_model=OrderResponse)
def get_order_detail(order_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    order = get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    return OrderResponse(id=order.id, user_id=order.user_id, items=[], total=order.total, status=order.status)

@router.patch("/orders/{order_id}/status", response_model=OrderResponse)
def update_status(order_id: int, status: str, db: Session = Depends(get_db), user = Depends(admin_role)):
    order = update_order_status(db, order_id, status)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return OrderResponse(id=order.id, user_id=order.user_id, items=[], total=order.total, status=order.status)