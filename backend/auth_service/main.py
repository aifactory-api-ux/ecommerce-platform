from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker
from backend.auth_service.routes import router as auth_router
from backend.auth_service.db import Base, engine, User, UserRole
from backend.auth_service.crud import create_user
from backend.auth_service.models import UserRegisterRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_session():
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok"}

app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    if session.query(User).count() == 0:
        admin_user = UserRegisterRequest(email="admin@example.com", password="admin123", name="Admin")
        create_user(session, admin_user, UserRole.admin)
        customer_user = UserRegisterRequest(email="customer@example.com", password="customer123", name="Customer")
        create_user(session, customer_user, UserRole.customer)
    session.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=23001)