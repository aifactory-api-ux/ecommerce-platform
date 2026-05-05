from pydantic import BaseModel, EmailStr
from typing import Literal

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserRegisterResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: Literal["customer", "admin"]

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"]

class TokenRefreshRequest(BaseModel):
    refresh_token: str

class TokenRefreshResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"]

class UserProfileResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: Literal["customer", "admin"]