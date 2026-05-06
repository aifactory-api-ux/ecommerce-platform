from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.shared.db import get_db_session
from backend.order_service.models import (
    OrderCreateRequest, OrderResponse, OrderListResponse, OrderItemResponse
)
from backend.order_service.crud import (
    get_order_by_id, get_orders_by_user_id, get_all_orders, create_order, update_order_status,
    OrderNotFoundError
)
from backend.product_service.crud import get_product_by_id
from .dependencies import get_current_user, require_role

router = APIRouter(prefix="/orders", tags=["orders"])

def calculate_order_total(items: List[dict], db: Session) -> float:
    total = 0.0
    for item in items:
        product = get_product_by_id(db, item.product_id)
        if product:
            total += float(product.price) * item.quantity
    return total

@router.post("/", response_model=OrderResponse)
def create_order_endpoint(
    request: OrderCreateRequest,
    db: Session = Depends(get_db_session),
    current_user = Depends(get_current_user)
):
    items_data = []
    total = 0.0
    
    for item in request.items:
        product = get_product_by_id(db, item.product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product {item.product_id} not found"
            )
        
        items_data.append({
            "product_id": product.id,
            "name": product.name,
            "price": float(product.price),
            "quantity": item.quantity
        })
        total += float(product.price) * item.quantity
    
    order = create_order(db, current_user.id, items_data, total)
    
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        status=order.status,
        total=float(order.total),
        items=[OrderItemResponse(**item) for item in order.items]
    )

@router.get("/", response_model=OrderListResponse)
def list_orders(
    db: Session = Depends(get_db_session),
    current_user = Depends(get_current_user)
):
    if current_user.role == "admin":
        orders = get_all_orders(db)
    else:
        orders = get_orders_by_user_id(db, current_user.id)
    
    return OrderListResponse(
        orders=[
            OrderResponse(
                id=o.id,
                user_id=o.user_id,
                status=o.status,
                total=float(o.total),
                items=[OrderItemResponse(**item) for item in o.items]
            )
            for o in orders
        ]
    )

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_endpoint(
    order_id: int,
    db: Session = Depends(get_db_session),
    current_user = Depends(get_current_user)
):
    order = get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        status=order.status,
        total=float(order.total),
        items=[OrderItemResponse(**item) for item in order.items]
    )

@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status_endpoint(
    order_id: int,
    request: dict,
    db: Session = Depends(get_db_session),
    current_user = Depends(require_role("admin"))
):
    status_value = request.get("status")
    if status_value not in ["pending", "paid", "shipped", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status value"
        )
    
    try:
        order = update_order_status(db, order_id, status_value)
        return OrderResponse(
            id=order.id,
            user_id=order.user_id,
            status=order.status,
            total=float(order.total),
            items=[OrderItemResponse(**item) for item in order.items]
        )
    except OrderNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")