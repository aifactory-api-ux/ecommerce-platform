import pytest
import jwt
from backend.shared.utils import hash_password, verify_password, create_access_token, create_refresh_token, decode_token, paginate

def test_password_hash_and_verify_success():
    password = 'MySecret123!'
    hashed = hash_password(password)
    assert verify_password(password, hashed) == True

def test_password_verify_failure():
    password = 'MySecret123!'
    hashed = hash_password(password)
    assert verify_password('WrongPass!', hashed) == False

def test_jwt_encode_and_decode_valid():
    payload = {'user_id': 1, 'role': 'admin'}
    secret = 'testsecret'
    token = create_access_token(payload)
    decoded = decode_token(token)
    assert decoded['user_id'] == 1
    assert decoded['role'] == 'admin'

def test_jwt_decode_invalid_token_raises_error():
    secret = 'testsecret'
    with pytest.raises(Exception):
        decode_token('invalid.token.value')

def test_pagination_helper_returns_correct_slice():
    items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    result = paginate(items, page=2, size=3)
    assert result == [4, 5, 6]