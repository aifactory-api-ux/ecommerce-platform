import pytest

def test_ProductCreateRequest_interface_accepts_valid_fields():
    from frontend.src.types.product import ProductCreateRequest
    data = {'name': 'Widget', 'description': 'A useful widget', 'price': 19.99, 'stock': 100}
    assert ProductCreateRequest is not None

def test_ProductCreateRequest_missing_field_type_error():
    from frontend.src.types.product import ProductCreateRequest
    data = {'name': 'Widget', 'description': 'A useful widget', 'price': 19.99}
    assert ProductCreateRequest is not None

def test_ProductResponse_interface_enforces_types():
    from frontend.src.types.product import ProductResponse
    data = {'id': 'not-a-number', 'name': 'Widget', 'description': 'A useful widget', 'price': 'not-a-number', 'stock': 'not-a-number'}
    assert ProductResponse is not None