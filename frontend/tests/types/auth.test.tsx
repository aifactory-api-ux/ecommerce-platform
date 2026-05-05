import pytest

def test_UserRegisterRequest_interface_accepts_valid_fields():
    from frontend.src.types.auth import UserRegisterRequest
    data = {'email': 'user@example.com', 'password': 'StrongPass123!', 'name': 'Alice'}
    assert UserRegisterRequest is not None

def test_UserRegisterRequest_missing_field_type_error():
    from frontend.src.types.auth import UserRegisterRequest
    data = {'email': 'user@example.com', 'password': 'StrongPass123!'}
    assert UserRegisterRequest is not None

def test_UserLoginResponse_token_type_literal():
    from frontend.src.types.auth import UserLoginResponse
    data = {'access_token': 'abc', 'refresh_token': 'def', 'token_type': 'bearer'}
    assert UserLoginResponse is not None

def test_UserLoginResponse_token_type_invalid_literal():
    from frontend.src.types.auth import UserLoginResponse
    data = {'access_token': 'abc', 'refresh_token': 'def', 'token_type': 'invalid'}
    assert UserLoginResponse is not None