import pytest
from pydantic import ValidationError
from backend.product_service.models import ProductCreateRequest

def test_product_create_request_valid_data():
    data = {'name': 'Test Product', 'description': 'A test product', 'price': 19.99, 'stock': 10}
    request = ProductCreateRequest(**data)
    assert request.name == 'Test Product'
    assert request.description == 'A test product'
    assert float(request.price) == 19.99
    assert request.stock == 10

def test_product_create_request_invalid_price_type():
    data = {'name': 'Test Product', 'description': 'A test product', 'price': 'not-a-number', 'stock': 10}
    with pytest.raises(ValidationError):
        ProductCreateRequest(**data)

def test_product_create_request_missing_required_field():
    data = {'name': 'Test Product', 'description': 'A test product', 'price': 19.99}
    with pytest.raises(ValidationError):
        ProductCreateRequest(**data)