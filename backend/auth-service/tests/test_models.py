import pytest
from pydantic import ValidationError
from backend.auth_service.models import ProductCreateRequest

def test_product_create_request_valid():
    data = {'name': 'Test Product', 'description': 'A product', 'price': 19.99, 'stock': 10}
    request = ProductCreateRequest(**data)
    assert request.name == 'Test Product'

def test_product_create_request_missing_field_raises_validation_error():
    data = {'description': 'A product', 'price': 19.99, 'stock': 10}
    with pytest.raises(ValidationError):
        ProductCreateRequest(**data)

def test_product_create_request_negative_stock_accepted():
    data = {'name': 'Test Product', 'description': 'A product', 'price': 19.99, 'stock': -5}
    request = ProductCreateRequest(**data)
    assert request.stock == -5