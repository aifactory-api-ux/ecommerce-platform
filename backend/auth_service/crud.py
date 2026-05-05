from sqlalchemy.orm import Session
from backend.auth_service.db import User, UserRole
from backend.auth_service.models import UserRegisterRequest
from backend.shared.utils import hash_password

def create_user(db: Session, user_data: UserRegisterRequest, role: UserRole = UserRole.customer) -> User:
    hashed = hash_password(user_data.password)
    user = User(email=user_data.email, hashed_password=hashed, name=user_data.name, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()