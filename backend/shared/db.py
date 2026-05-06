from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

Base = declarative_base()

def get_db_session():
    database_url = os.getenv("DATABASE_URL", "postgresql://ecommerce:secretpassword@postgres:5432/ecommerce")
    engine = create_engine(database_url, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def create_tables():
    Base.metadata.create_all(bind=engine)