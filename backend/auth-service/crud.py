from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .db import User
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserNotFoundError(Exception):
    pass

class EmailAlreadyExistsError(Exception):
    pass

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, email: str, password: str, name: str) -> User:
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise EmailAlreadyExistsError("Email already registered")
    
    hashed_password = pwd_context.hash(password)
    user = User(email=email, hashed_password=hashed_password, name=name, role="customer")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user