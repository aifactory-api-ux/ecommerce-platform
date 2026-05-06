import pytest
import jwt
from backend.shared.jwt_utils import create_access_token, create_refresh_token, decode_token
from jwt import ExpiredSignatureError, InvalidTokenError

def test_jwt_encode_and_decode_valid_token():
    payload = {'user_id': 1, 'role': 'customer'}
    token = create_access_token(payload)
    decoded = decode_token(token)
    assert decoded['user_id'] == 1
    assert decoded['role'] == 'customer'

def test_jwt_decode_invalid_token_raises_error():
    with pytest.raises(InvalidTokenError):
        decode_token('invalid.token.value')

def test_jwt_expired_token_raises_expired_signature_error():
    payload = {'user_id': 1, 'exp': 0}
    token = jwt.encode(payload, 'supersecretjwtkey', algorithm='HS256')
    with pytest.raises(ExpiredSignatureError):
        decode_token(token)