import pytest
from backend.auth_service.auth import hash_password, verify_password, create_access_token, decode_jwt
from fastapi import HTTPException

def test_hash_password_and_verify_password_success():
    password = 'MySecret123!'
    hashed = hash_password(password)
    assert verify_password(password, hashed) == True

def test_verify_password_wrong_password_returns_false():
    password = 'MySecret123!'
    hashed = hash_password(password)
    assert verify_password('WrongSecret', hashed) == False

def test_jwt_encode_and_decode_returns_original_payload():
    payload = {'sub': 'user_id', 'role': 'customer'}
    token = create_access_token(payload)
    decoded = decode_jwt(token)
    assert decoded['sub'] == 'user_id'
    assert decoded['role'] == 'customer'

def test_decode_jwt_with_invalid_token_raises_exception():
    with pytest.raises(Exception):
        decode_jwt('invalid.jwt.token')

def test_rbac_dependency_allows_authorized_role():
    from backend.auth_service.dependencies import admin_role
    class MockUser:
        role = 'admin'
    user = MockUser()
    result = admin_role(user)
    assert result.role == 'admin'

def test_rbac_dependency_denies_unauthorized_role():
    from backend.auth_service.dependencies import admin_role
    class MockUser:
        role = 'customer'
    user = MockUser()
    with pytest.raises(HTTPException) as exc_info:
        admin_role(user)
    assert exc_info.value.status_code == 403