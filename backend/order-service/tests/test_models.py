import pytest
from pydantic import ValidationError
from backend.order_service.models import OrderCreateRequest, OrderItemRequest

def test_order_create_request_validates_items():
    data = {'items': [{'product_id': 1, 'quantity': 2}]}
    request = OrderCreateRequest(**data)
    assert len(request.items) == 1

def test_order_create_request_empty_items_invalid():
    data = {'items': []}
    with pytest.raises(ValidationError):
        OrderCreateRequest(**data)

def test_order_item_request_negative_quantity_invalid():
    data = {'product_id': 1, 'quantity': -1}
    with pytest.raises(ValidationError):
        OrderItemRequest(**data)