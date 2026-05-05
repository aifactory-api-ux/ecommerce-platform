from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker
from backend.product_service.routes import router as product_router
from backend.product_service.db import Base, engine, Category, Product

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

app.include_router(product_router, prefix="/products", tags=["products"])

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    if session.query(Category).count() == 0:
        categories = [
            Category(name="Electronics"),
            Category(name="Books"),
            Category(name="Clothing"),
        ]
        session.add_all(categories)
        session.commit()
        electronics = session.query(Category).filter_by(name="Electronics").first()
        books = session.query(Category).filter_by(name="Books").first()
        clothing = session.query(Category).filter_by(name="Clothing").first()
        products = [
            Product(name="Laptop", description="High performance laptop", price=999.99, stock=10, category_id=electronics.id if electronics else None),
            Product(name="Smartphone", description="Latest smartphone", price=699.99, stock=15, category_id=electronics.id if electronics else None),
            Product(name="Headphones", description="Wireless headphones", price=149.99, stock=20, category_id=electronics.id if electronics else None),
            Product(name="Novel Book", description="Bestselling novel", price=19.99, stock=50, category_id=books.id if books else None),
            Product(name="Textbook", description="Computer Science textbook", price=89.99, stock=30, category_id=books.id if books else None),
            Product(name="T-Shirt", description="Cotton t-shirt", price=24.99, stock=100, category_id=clothing.id if clothing else None),
            Product(name="Jeans", description="Denim jeans", price=49.99, stock=75, category_id=clothing.id if clothing else None),
            Product(name="Jacket", description="Winter jacket", price=99.99, stock=40, category_id=clothing.id if clothing else None),
        ]
        session.add_all(products)
        session.commit()
    session.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=23002)