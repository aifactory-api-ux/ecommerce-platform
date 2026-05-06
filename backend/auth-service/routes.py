from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.shared.db import get_db_session
from backend.auth_service.models import (
    UserRegisterRequest, UserLoginRequest, UserResponse,
    TokenResponse, TokenRefreshRequest
)
from backend.auth_service.crud import create_user, authenticate_user, get_user_by_id, get_user_by_email
from backend.shared.jwt_utils import create_access_token, create_refresh_token, decode_token
from .dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(request: UserRegisterRequest, db: Session = Depends(get_db_session)):
    try:
        user = create_user(db, request.email, request.password, request.name)
        return UserResponse(id=user.id, email=user.email, name=user.name, role=user.role)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login", response_model=TokenResponse)
def login(request: UserLoginRequest, db: Session = Depends(get_db_session)):
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token({"user_id": user.id, "role": user.role})
    refresh_token = create_refresh_token({"user_id": user.id, "role": user.role})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh(request: TokenRefreshRequest, db: Session = Depends(get_db_session)):
    try:
        payload = decode_token(request.refresh_token)
        user_id = payload.get("user_id")
        role = payload.get("role")
        
        user = get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        access_token = create_access_token({"user_id": user_id, "role": role})
        refresh_token = create_refresh_token({"user_id": user_id, "role": role})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return UserResponse(id=current_user.id, email=current_user.email, name=current_user.name, role=current_user.role)