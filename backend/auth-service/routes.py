from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.auth_service.models import (
    UserRegisterRequest, UserRegisterResponse, UserLoginRequest,
    UserLoginResponse, TokenRefreshRequest, TokenRefreshResponse, UserProfileResponse
)
from backend.auth_service.crud import create_user, get_user_by_email
from backend.auth_service.auth import verify_password, create_access_token, create_refresh_token, decode_jwt
from backend.auth_service.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/register", response_model=UserRegisterResponse)
def register(user_data: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, user_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    from backend.auth_service.db import UserRole
    user = create_user(db, user_data, UserRole.customer)
    return UserRegisterResponse(id=user.id, email=user.email, name=user.name, role=user.role)

@router.post("/login", response_model=UserLoginResponse)
def login(credentials: UserLoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, credentials.email)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"user_id": user.id, "role": user.role})
    refresh_token = create_refresh_token({"user_id": user.id})
    return UserLoginResponse(access_token=access_token, refresh_token=refresh_token, token_type="bearer")

@router.post("/refresh", response_model=TokenRefreshResponse)
def refresh_token(data: TokenRefreshRequest):
    payload = decode_jwt(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    access_token = create_access_token({"user_id": payload.get("user_id"), "role": payload.get("role")})
    return TokenRefreshResponse(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserProfileResponse)
def get_profile(user = Depends(get_current_user)):
    return UserProfileResponse(id=user.id, email=user.email, name=user.name, role=user.role)