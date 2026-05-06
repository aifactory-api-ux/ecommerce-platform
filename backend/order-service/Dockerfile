FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir \
    fastapi==0.110.0 \
    uvicorn==0.29.0 \
    sqlalchemy==2.0.29 \
    alembic==1.13.1 \
    psycopg2-binary \
    passlib==1.7.4 \
    pyjwt==2.8.0 \
    pydantic[email]

COPY backend/shared /app/backend/shared
COPY backend/auth-service /app/backend/auth-service
COPY backend/order-service /app/backend/order-service

ENV PYTHONPATH=/app
ENV DATABASE_URL=postgresql://ecommerce:secretpassword@postgres:5432/ecommerce

EXPOSE 23003

CMD ["uvicorn", "backend.order-service.main:app", "--host", "0.0.0.0", "--port", "23003"]