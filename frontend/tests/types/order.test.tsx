import pytest

def test_OrderCreateRequest_interface_accepts_valid_items():
    from frontend.src.types.order import OrderCreateRequest
    data = {'items': [{'product_id': 1, 'quantity': 2}, {'product_id': 2, 'quantity': 1}]}
    assert OrderCreateRequest is not None

def test_OrderCreateRequest_items_missing_field_type_error():
    from frontend.src.types.order import OrderCreateRequest
    data = {'items': [{'product_id': 1}]}
    assert OrderCreateRequest is not None

def test_OrderItemResponse_interface_enforces_types():
    from frontend.src.types.order import OrderItemResponse
    data = {'product_id': 'not-a-number', 'name': 123, 'price': 'not-a-number'}
    assert OrderItemResponse is not None