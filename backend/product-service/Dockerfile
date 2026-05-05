FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 23002
CMD ["uvicorn", "backend.product-service.main:app", "--host", "0.0.0.0", "--port", "23002"]