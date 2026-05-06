# MASTER DEVELOPMENT PLAN

> Fuente de verdad única. Los nombres de clases, fields, rutas y variables
> definidos en §1 son los ÚNICOS válidos — el coder no puede inventar nombres.
> En §2 cada wave muestra 🔴 TEST primero y 🟢 PROD después: escríbelos en ese orden.

---

# §1 Contratos Globales

## §1.1 Especificación Técnica — Stack, Modelos, Estructura, Env Vars

# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Python 3.11
  - FastAPI 0.110.0
  - SQLAlchemy 2.0.29
  - Alembic 1.13.1
  - PostgreSQL 15
  - Redis 7.2
  - PyJWT 2.8.0
  - passlib 1.7.4
  - uvicorn 0.29.0

- **Frontend**
  - React 18.2.0
  - Vite 5.1.0
  - React Router DOM 6.22.3
  - JavaScript (ES2022)
  - Axios 1.6.7

- **Infrastructure**
  - Docker 26.0.0
  - Docker Compose 2.26.1

## 2. DATA CONTRACTS

### Python (Pydantic Models)

#### backend/auth-service/models.py

```python
from pydantic import BaseModel, EmailStr
from typing import Literal

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: Literal["customer", "admin"]

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"]

class TokenRefreshRequest(BaseModel):
    refresh_token: str
```

#### backend/product-service/models.py

```python
from pydantic import BaseModel, condecimal
from typing import List

class ProductCreateRequest(BaseModel):
    name: str
    description: str
    price: condecimal(max_digits=10, decimal_places=2)
    stock: int

class ProductUpdateRequest(BaseModel):
    name: str
    description: str
    price: condecimal(max_digits=10, decimal_places=2)
    stock: int

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    stock: int

class ProductListResponse(BaseModel):
    products: List[ProductResponse]
```

#### backend/order-service/models.py

```python
from pydantic import BaseModel, condecimal
from typing import List

class OrderItemRequest(BaseModel):
    product_id: int
    quantity: int

class OrderCreateRequest(BaseModel):
    items: List[OrderItemRequest]

class OrderItemResponse(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int

class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    total: float
    items: List[OrderItemResponse]

class OrderListResponse(BaseModel):
    orders: List[OrderResponse]
```

### TypeScript (Frontend Interfaces)

#### src/types/auth.ts

```typescript
export interface UserRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: "customer" | "admin";
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface TokenRefreshRequest {
  refresh_token: string;
}
```

#### src/types/product.ts

```typescript
export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductUpdateRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductListResponse {
  products: ProductResponse[];
}
```

#### src/types/order.ts

```typescript
export interface OrderItemRequest {
  product_id: number;
  quantity: number;
}

export interface OrderCreateRequest {
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  user_id: number;
  status: string;
  total: number;
  items: OrderItemResponse[];
}

export interface OrderListResponse {
  orders: OrderResponse[];
}
```

## 3. API ENDPOINTS

### Auth Service (`/auth`)

- **POST /auth/register**
  - Request: `UserRegisterRequest`
  - Response: `UserResponse`
- **POST /auth/login**
  - Request: `UserLoginRequest`
  - Response: `TokenResponse`
- **POST /auth/refresh**
  - Request: `TokenRefreshRequest`
  - Response: `TokenResponse`
- **GET /auth/me**
  - Auth: Bearer token
  - Response: `UserResponse`

### Product Service (`/products`)

- **POST /products/**
  - Auth: Bearer token (admin only)
  - Request: `ProductCreateRequest`
  - Response: `ProductResponse`
- **GET /products/**
  - Response: `ProductListResponse`
- **GET /products/{product_id}**
  - Response: `ProductResponse`
- **PUT /products/{product_id}**
  - Auth: Bearer token (admin only)
  - Request: `ProductUpdateRequest`
  - Response: `ProductResponse`
- **DELETE /products/{product_id}**
  - Auth: Bearer token (admin only)
  - Response: `{ "detail": "Product deleted" }`

### Order Service (`/orders`)

- **POST /orders/**
  - Auth: Bearer token (customer only)
  - Request: `OrderCreateRequest`
  - Response: `OrderResponse`
- **GET /orders/**
  - Auth: Bearer token
  - Response: `OrderListResponse`
- **GET /orders/{order_id}**
  - Auth: Bearer token (owner or admin)
  - Response: `OrderResponse`
- **PUT /orders/{order_id}/status**
  - Auth: Bearer token (admin only)
  - Request: `{ "status": "pending" | "paid" | "shipped" | "cancelled" }`
  - Response: `OrderResponse`

## 4. FILE STRUCTURE

### PORT TABLE

| Service           | Listening Port | Path                        |
|-------------------|---------------|-----------------------------|
| auth-service      | 23001         | backend/auth-service/       |
| product-service   | 23002         | backend/product-service/    |
| order-service     | 23003         | backend/order-service/      |

### SHARED MODULES

| Shared path        | Imported by services                        |
|--------------------|---------------------------------------------|
| backend/shared/    | auth-service, product-service, order-service|

### FILE TREE

```
.
├── docker-compose.yml                # Multi-service orchestration
├── .env.example                     # Template for all environment variables
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── run.sh                           # Root startup script
├── backend/
│   ├── shared/                      # Shared Python modules (schemas, utils)
│   │   ├── db.py                    # Shared DB connection logic
│   │   ├── jwt_utils.py             # JWT encode/decode helpers
│   │   └── __init__.py
│   ├── auth-service/
│   │   ├── Dockerfile               # Auth service container build
│   │   ├── main.py                  # FastAPI entrypoint
│   │   ├── models.py                # Pydantic models
│   │   ├── db.py                    # SQLAlchemy models and session
│   │   ├── crud.py                  # CRUD logic
│   │   ├── routes.py                # FastAPI routers
│   │   ├── dependencies.py          # Auth dependencies
│   │   ├── alembic.ini              # Alembic config
│   │   ├── migrations/              # Alembic migrations
│   │   └── __init__.py
│   ├── product-service/
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── db.py
│   │   ├── crud.py
│   │   ├── routes.py
│   │   ├── dependencies.py
│   │   ├── alembic.ini
│   │   ├── migrations/
│   │   └── __init__.py
│   ├── order-service/
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── db.py
│   │   ├── crud.py
│   │   ├── routes.py
│   │   ├── dependencies.py
│   │   ├── alembic.ini
│   │   ├── migrations/
│   │   └── __init__.py
├── frontend/
│   ├── Dockerfile                   # Frontend container build
│   ├── vite.config.js               # Vite configuration
│   ├── index.html                   # HTML entrypoint
│   ├── src/
│   │   ├── main.jsx                 # React entrypoint
│   │   ├── App.jsx                  # Root component
│   │   ├── router.jsx               # React Router setup
│   │   ├── api/
│   │   │   ├── auth.js              # Auth API calls
│   │   │   ├── product.js           # Product API calls
│   │   │   └── order.js             # Order API calls
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth state hook
│   │   │   ├── useProducts.js       # Product state hook
│   │   │   └── useOrders.js         # Order state hook
│   │   ├── types/
│   │   │   ├── auth.ts              # Auth interfaces
│   │   │   ├── product.ts           # Product interfaces
│   │   │   └── order.ts             # Order interfaces
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── UserMenu.jsx
│   │   │   ├── Product/
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   └── ProductDetail.jsx
│   │   │   ├── Order/
│   │   │   │   ├── OrderList.jsx
│   │   │   │   ├── OrderForm.jsx
│   │   │   │   └── OrderDetail.jsx
│   │   │   └── Layout/
│   │   │       ├── Header.jsx
│   │   │       └── Footer.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Products.jsx
│   │       ├── ProductEdit.jsx
│   │       ├── Orders.jsx
│   │       ├── OrderDetail.jsx
│   │       └── AdminDashboard.jsx
│   └── .env.example                 # Frontend env vars template
├── postgres/
│   └── init.sql                     # DB initialization script
├── redis/
│   └── redis.conf                   # Redis config
```

## 5. ENVIRONMENT VARIABLES

| Name                        | Type    | Description                                      | Example Value                |
|-----------------------------|---------|--------------------------------------------------|-----------------------------|
| POSTGRES_HOST               | string  | PostgreSQL host                                  | postgres                    |
| POSTGRES_PORT               | int     | PostgreSQL port (container-internal)             | 5432                        |
| POSTGRES_USER               | string  | PostgreSQL username                              | ecommerce                   |
| POSTGRES_PASSWORD           | string  | PostgreSQL password                              | secretpassword              |
| POSTGRES_DB                 | string  | PostgreSQL database name                         | ecommerce                   |
| REDIS_HOST                  | string  | Redis host                                       | redis                       |
| REDIS_PORT                  | int     | Redis port (container-internal)                  | 6379                        |
| AUTH_SERVICE_PORT           | int     | Auth service listening port                      | 23001                       |
| PRODUCT_SERVICE_PORT        | int     | Product service listening port                   | 23002                       |
| ORDER_SERVICE_PORT          | int     | Order service listening port                     | 23003                       |
| JWT_SECRET_KEY              | string  | Secret key for JWT signing                       | supersecretjwtkey           |
| JWT_ACCESS_TOKEN_EXPIRE_MIN | int     | Access token expiry (minutes)                    | 30                          |
| JWT_REFRESH_TOKEN_EXPIRE_HR | int     | Refresh token expiry (hours)                     | 24                          |
| FRONTEND_PORT               | int     | Frontend listening port                          | 24000                       |
| VITE_API_AUTH_URL           | string  | Frontend: Auth API base URL                      | http://localhost:23001/auth |
| VITE_API_PRODUCT_URL        | string  | Frontend: Product API base URL                   | http://localhost:23002/products |
| VITE_API_ORDER_URL          | string  | Frontend: Order API base URL                     | http://localhost:23003/orders |
| NODE_ENV                    | string  | Frontend: Environment                            | development                 |

## 6. IMPORT CONTRACTS

### backend/shared/db.py

- `from backend.shared.db import get_db_session, Base`

### backend/shared/jwt_utils.py

- `from backend.shared.jwt_utils import create_access_token, create_refresh_token, decode_token`

### backend/auth-service/models.py

- `from backend.auth-service.models import UserRegisterRequest, UserLoginRequest, UserResponse, TokenResponse, TokenRefreshRequest`

### backend/product-service/models.py

- `from backend.product-service.models import ProductCreateRequest, ProductUpdateRequest, ProductResponse, ProductListResponse`

### backend/order-service/models.py

- `from backend.order-service.models import OrderCreateRequest, OrderItemRequest, OrderResponse, OrderListResponse, OrderItemResponse`

### frontend/src/types/auth.ts

- `import { UserRegisterRequest, UserLoginRequest, UserResponse, TokenResponse, TokenRefreshRequest } from '../types/auth'`

### frontend/src/types/product.ts

- `import { ProductCreateRequest, ProductUpdateRequest, ProductResponse, ProductListResponse } from '../types/product'`

### frontend/src/types/order.ts

- `import { OrderCreateRequest, OrderItemRequest, OrderResponse, OrderListResponse, OrderItemResponse } from '../types/order'`

### frontend/src/hooks/useAuth.js

- `export function useAuth() → { user, loading, error, login, register, logout, refreshToken, isAuthenticated }`

### frontend/src/hooks/useProducts.js

- `export function useProducts() → { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct }`

### frontend/src/hooks/useOrders.js

- `export function useOrders() → { orders, loading, error, fetchOrders, createOrder, updateOrderStatus }`

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives

- **useAuth()** → `{ user, loading, error, login, register, logout, refreshToken, isAuthenticated }`
  - `user`: `UserResponse | null`
  - `loading`: `boolean`
  - `error`: `string | null`
  - `login(email: string, password: string): Promise<void>`
  - `register(data: UserRegisterRequest): Promise<void>`
  - `logout(): void`
  - `refreshToken(): Promise<void>`
  - `isAuthenticated`: `boolean`

- **useProducts()** → `{ products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct }`
  - `products`: `ProductResponse[]`
  - `loading`: `boolean`
  - `error`: `string | null`
  - `fetchProducts(): Promise<void>`
  - `createProduct(data: ProductCreateRequest): Promise<void>`
  - `updateProduct(id: number, data: ProductUpdateRequest): Promise<void>`
  - `deleteProduct(id: number): Promise<void>`

- **useOrders()** → `{ orders, loading, error, fetchOrders, createOrder, updateOrderStatus }`
  - `orders`: `OrderResponse[]`
  - `loading`: `boolean`
  - `error`: `string | null`
  - `fetchOrders(): Promise<void>`
  - `createOrder(data: OrderCreateRequest): Promise<void>`
  - `updateOrderStatus(orderId: number, status: string): Promise<void>`

### Reusable Component Props

- **LoginForm** props: `{ onSubmit: (data: UserLoginRequest) => void, loading: boolean, error: string | null }`
- **RegisterForm** props: `{ onSubmit: (data: UserRegisterRequest) => void, loading: boolean, error: string | null }`
- **UserMenu** props: `{ user: UserResponse | null, onLogout: () => void }`
- **ProductList** props: `{ products: ProductResponse[], onEdit: (id: number) => void, onDelete: (id: number) => void, loading: boolean }`
- **ProductForm** props: `{ initial?: ProductCreateRequest | ProductUpdateRequest, onSubmit: (data: ProductCreateRequest | ProductUpdateRequest) => void, loading: boolean }`
- **ProductDetail** props: `{ product: ProductResponse, onAddToCart?: (id: number) => void }`
- **OrderList** props: `{ orders: OrderResponse[], onView: (id: number) => void, loading: boolean }`
- **OrderForm** props: `{ onSubmit: (data: OrderCreateRequest) => void, loading: boolean }`
- **OrderDetail** props: `{ order: OrderResponse }`
- **Header** props: `{ user: UserResponse | null, onLogout: () => void }`
- **Footer** props: `{}`

## 8. FILE EXTENSION CONVENTION

- **Frontend files use `.jsx` for all React components and hooks.**
- **Project is JavaScript (not TypeScript) for implementation, but all type definitions are in `.ts` files under `src/types/`.**
- **Entry point:** `/src/main.jsx` (as referenced in `index.html` via `<script type="module" src="/src/main.jsx"></script>`)
- **No `.tsx` files are used.**
- **All backend Python files use `.py`.**
- **All Dockerfiles are named `Dockerfile` (no extension).**
- **All environment variable templates are `.env.example`.**
- **All configuration files use their standard extensions (`.yml`, `.js`, `.ini`).**

## §1.2 Contrato API (OpenAPI 3.1)
> Ref obligatoria para tests de endpoints: usa los paths, schemas y status codes exactos de aquí.

```yaml
# API_CONTRACT.md

## Auth Service (`/auth`)

| Method | Path           | Auth Required | Request Body Schema         | Response Schema         | Status Codes |
|--------|----------------|--------------|----------------------------|------------------------|-------------|
| POST   | /auth/register | No           | UserRegisterRequest        | UserResponse           | 200         |
| POST   | /auth/login    | No           | UserLoginRequest           | TokenResponse          | 200         |
| POST   | /auth/refresh  | No           | TokenRefreshRequest        | TokenResponse          | 200         |
| GET    | /auth/me       | Yes (Bearer) | —                          | UserResponse           | 200         |

### Schemas

#### UserRegisterRequest

| Field    | Type    | Required |
|----------|---------|----------|
| email    | string  | Yes      |
| password | string  | Yes      |
| name     | string  | Yes      |

#### UserLoginRequest

| Field    | Type    | Required |
|----------|---------|----------|
| email    | string  | Yes      |
| password | string  | Yes      |

#### TokenRefreshRequest

| Field         | Type    | Required |
|---------------|---------|----------|
| refresh_token | string  | Yes      |

#### UserResponse

| Field | Type    |
|-------|---------|
| id    | int     |
| email | string  |
| name  | string  |
| role  | "customer" \| "admin" |

#### TokenResponse

| Field         | Type    |
|---------------|---------|
| access_token  | string  |
| refresh_token | string  |
| token_type    | "bearer"|

---

## Product Service (`/products`)

| Method | Path                       | Auth Required         | Request Body Schema      | Response Schema         | Status Codes |
|--------|----------------------------|----------------------|-------------------------|------------------------|-------------|
| POST   | /products/                 | Yes (Bearer, admin)  | ProductCreateRequest    | ProductResponse        | 200         |
| GET    | /products/                 | No                   | —                       | ProductListResponse    | 200         |
| GET    | /products/{product_id}     | No                   | —                       | ProductResponse        | 200         |
| PUT    | /products/{product_id}     | Yes (Bearer, admin)  | ProductUpdateRequest    | ProductResponse        | 200         |
| DELETE | /products/{product_id}     | Yes (Bearer, admin)  | —                       | { "detail": "Product deleted" } | 200 |

### Schemas

#### ProductCreateRequest

| Field       | Type   | Required |
|-------------|--------|----------|
| name        | string | Yes      |
| description | string | Yes      |
| price       | number | Yes      |
| stock       | int    | Yes      |

#### ProductUpdateRequest

| Field       | Type   | Required |
|-------------|--------|----------|
| name        | string | Yes      |
| description | string | Yes      |
| price       | number | Yes      |
| stock       | int    | Yes      |

#### ProductResponse

| Field       | Type   |
|-------------|--------|
| id          | int    |
| name        | string |
| description | string |
| price       | number |
| stock       | int    |

#### ProductListResponse

| Field    | Type                |
|----------|---------------------|
| products | ProductResponse[]   |

#### DELETE /products/{product_id} Response

| Field  | Type   |
|--------|--------|
| detail | string |

---

## Order Service (`/orders`)

| Method | Path                          | Auth Required                | Request Body Schema         | Response Schema         | Status Codes |
|--------|-------------------------------|------------------------------|----------------------------|------------------------|-------------|
| POST   | /orders/                      | Yes (Bearer, customer only)  | OrderCreateRequest         | OrderResponse          | 200         |
| GET    | /orders/                      | Yes (Bearer)                 | —                          | OrderListResponse      | 200         |
| GET    | /orders/{order_id}            | Yes (Bearer, owner or admin) | —                          | OrderResponse          | 200         |
| PUT    | /orders/{order_id}/status     | Yes (Bearer, admin only)     | { "status": "pending" \| "paid" \| "shipped" \| "cancelled" } | OrderResponse | 200 |

### Schemas

#### OrderItemRequest

| Field      | Type   | Required |
|------------|--------|----------|
| product_id | int    | Yes      |
| quantity   | int    | Yes      |

#### OrderCreateRequest

| Field | Type                | Required |
|-------|---------------------|----------|
| items | OrderItemRequest[]  | Yes      |

#### OrderItemResponse

| Field      | Type   |
|------------|--------|
| product_id | int    |
| name       | string |
| price      | number |
| quantity   | int    |

#### OrderResponse

| Field   | Type                  |
|---------|-----------------------|
| id      | int                   |
| user_id | int                   |
| status  | string                |
| total   | number                |
| items   | OrderItemResponse[]   |

#### OrderListResponse

| Field  | Type             |
|--------|------------------|
| orders | OrderResponse[]  |

#### PUT /orders/{order_id}/status Request

| Field  | Type                                              | Required |
|--------|---------------------------------------------------|----------|
| status | "pending" \| "paid" \| "shipped" \| "cancelled"   | Yes      |
```

## §1.3 Archivos de Test y Scripts a Crear (TDD — complemento de la estructura §1.1)
> La FILE STRUCTURE de §1.1 fue generada antes de los specs TDD — no incluye `tests/` ni `run_tests.sh`.
> Los siguientes archivos son OBLIGATORIOS. Créalos en los paths exactos indicados.
> ⚠️  NUNCA usar archivos `.spec.*` co-ubicados con el source.

**Scripts de ejecución (crear y hacer chmod +x):**
- `backend/run_tests.sh`
- `frontend/run_tests.sh`

**Archivos de test (crear en los paths exactos):**
- `backend/tests/test_crud.py`
- `backend/tests/test_db.py`
- `backend/tests/test_dependencies.py`
- `backend/tests/test_docker_orchestration.py`
- `backend/tests/test_jwt_utils.py`
- `backend/tests/test_main.py`
- `backend/tests/test_models.py`
- `backend/tests/test_routes.py`
- `frontend/tests/App.test.jsx`
- `frontend/tests/components/Auth/LoginForm.test.jsx`
- `frontend/tests/components/Auth/RegisterForm.test.jsx`
- `frontend/tests/components/Auth/UserMenu.test.jsx`
- `frontend/tests/components/Layout/Footer.test.jsx`
- `frontend/tests/components/Layout/Header.test.jsx`
- `frontend/tests/components/Order/OrderDetail.test.jsx`
- `frontend/tests/components/Order/OrderForm.test.jsx`
- `frontend/tests/components/Order/OrderList.test.jsx`
- `frontend/tests/components/Product/ProductDetail.test.jsx`
- `frontend/tests/components/Product/ProductForm.test.jsx`
- `frontend/tests/components/Product/ProductList.test.jsx`
- `frontend/tests/hooks/useOrders.test.jsx`
- `frontend/tests/index.test.jsx`
- `frontend/tests/main.test.jsx`
- `frontend/tests/pages/AdminDashboard.test.jsx`
- `frontend/tests/pages/Home.test.jsx`
- `frontend/tests/pages/Login.test.jsx`
- `frontend/tests/pages/OrderDetail.test.jsx`
- `frontend/tests/pages/Orders.test.jsx`
- `frontend/tests/pages/ProductEdit.test.jsx`
- `frontend/tests/pages/Products.test.jsx`
- `frontend/tests/pages/Register.test.jsx`
- `frontend/tests/router.test.jsx`
- `frontend/tests/vite.config.test.jsx`

---

# §2 Plan de Implementación

> **REGLA TDD OBLIGATORIA**
> 1. Escribe el ítem 🔴 TEST completo antes de tocar el ítem 🟢 PROD.
> 2. Corre los tests: deben fallar (RED). Si pasan sin código de producción, el test está mal.
> 3. Escribe el código de producción mínimo para que pasen (GREEN).
> 4. Si los tests fallan después del paso 3, corrige SOLO producción — nunca los tests.

## Wave 1

### 🟢 PROD — run_tests.sh — backend
> Crea el script ejecutable `backend/run_tests.sh` que instala dependencias de test y corre todos los tests de `backend/tests/`. El script debe hacer `chmod +x` sobre sí mismo al final. Contenido exacto: ver §1.3 del plan.
**Archivos:**
  - `backend/run_tests.sh`


### 🟢 PROD — run_tests.sh — frontend
> Crea el script ejecutable `frontend/run_tests.sh` que instala dependencias de test y corre todos los tests de `frontend/tests/`. El script debe hacer `chmod +x` sobre sí mismo al final. Contenido exacto: ver §1.3 del plan.
**Archivos:**
  - `frontend/run_tests.sh`


### 🔴 TEST — Tests: backend/shared/models.py
> Ref: §1.1 (modelos de `backend/product-service/models.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_models.py`

**Casos de prueba (implementar todos):**
- `test_product_create_request_valid_data`: ProductCreateRequest should accept valid name, description, price, and stock
  - Input: `{'name': 'Test Product', 'description': 'A test product', 'price': 19.99, 'stock': 10}`
  - Expected: `{'valid': True}`
- `test_product_create_request_invalid_price_type`: ProductCreateRequest should raise validation error if price is not a number
  - Input: `{'name': 'Test Product', 'description': 'A test product', 'price': 'not-a-number', 'stock': 10}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_product_create_request_missing_required_field`: ProductCreateRequest should raise validation error if a required field is missing
  - Input: `{'name': 'Test Product', 'description': 'A test product', 'price': 19.99}`
  - Expected: `{'raises': 'ValidationError'}`

### 🔴 TEST — Tests: backend/shared/db.py
> Ref: §1.1 (modelos de `backend/product-service/db.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_db.py`

**Casos de prueba (implementar todos):**
- `test_product_model_persistence`: Product SQLAlchemy model should persist and retrieve data correctly in SQLite in-memory DB
  - Input: `{'product': {'name': 'DB Product', 'description': 'Persisted product', 'price': 9.99, 'stock': 5}}`
  - Expected: `{'fields': ['id', 'name', 'description', 'price', 'stock'], 'name': 'DB Product'}`
- `test_product_model_negative_stock`: Product model should not allow negative stock values
  - Input: `{'product': {'name': 'Negative Stock', 'description': 'Invalid stock', 'price': 5.0, 'stock': -1}}`
  - Expected: `{'raises': 'IntegrityError'}`
- `test_product_model_large_price`: Product model should handle large price values within max_digits=10, decimal_places=2
  - Input: `{'product': {'name': 'Expensive Product', 'description': 'High price', 'price': 99999999.99, 'stock': 1}}`
  - Expected: `{'valid': True}`

### 🔴 TEST — Tests: backend/shared/jwt_utils.py
> Ref: §1.1 (modelos de `backend/shared/jwt_utils.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_jwt_utils.py`

**Casos de prueba (implementar todos):**
- `test_jwt_encode_and_decode_valid_token`: JWT encode and decode helpers correctly encode and decode a payload.
  - Input: `{'payload': {'user_id': 1, 'role': 'customer'}, 'secret': 'testsecret'}`
  - Expected: `{'decoded_payload': {'user_id': 1, 'role': 'customer'}}`
- `test_jwt_decode_invalid_token_raises_error`: Decoding an invalid JWT token raises an appropriate exception.
  - Input: `{'token': 'invalid.token.value', 'secret': 'testsecret'}`
  - Expected: `{'raises': 'JWTError'}`
- `test_jwt_expired_token_raises_expired_signature_error`: Decoding an expired JWT token raises ExpiredSignatureError.
  - Input: `{'payload': {'user_id': 1, 'exp': 0}, 'secret': 'testsecret'}`
  - Expected: `{'raises': 'ExpiredSignatureError'}`

### 🔴 TEST — Tests: frontend/src/hooks/useOrders.js
> Ref: §1.1 (modelos de `frontend/src/hooks/useOrders.js`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/hooks/useOrders.test.jsx`

**Casos de prueba (implementar todos):**
- `returns_initial_empty_orders_state`: When the hook is first rendered, it should return an empty orders array and loading=false.
  - Expected: `{'orders': [], 'loading': False, 'error': None}`
- `fetches_orders_successfully_and_updates_state`: When fetchOrders is called and the API returns a valid OrderListResponse, the hook should update orders state with the response and set loading=false.
  - Input: `{'apiResponse': {'orders': [{'id': 1, 'user_id': 2, 'status': 'pending', 'total': 100.0, 'items': [{'product_id': 10, 'name': 'Widget', 'price': 50.0, 'quantity': 2}]}]}}`
  - Expected: `{'orders': [{'id': 1, 'user_id': 2, 'status': 'pending', 'total': 100.0, 'items': [{'product_id': 10, 'name': 'Widget', 'price': 50.0, 'quantity': 2}]}], 'loading': False, 'error': None}`
- `handles_api_error_and_sets_error_state`: When fetchOrders is called and the API returns an error (e.g. 401 Unauthorized), the hook should set error to the error message and loading=false.
  - Input: `{'apiError': {'status': 401, 'message': 'Unauthorized'}}`
  - Expected: `{'orders': [], 'loading': False, 'error': 'Unauthorized'}`
- `creates_order_and_appends_to_orders_state`: When createOrder is called with a valid OrderCreateRequest and the API returns a valid OrderResponse, the hook should append the new order to the orders state.
  - Input: `{'orderCreateRequest': {'items': [{'product_id': 5, 'quantity': 1}]}, 'apiResponse': {'id': 2, 'user_id': 2, 'status': 'pending', 'total': 25.0, 'items': [{'product_id': 5, 'name': 'Gadget', 'price': 25.0, 'quantity': 1}]}}`
  - Expected: `{'ordersAppended': True, 'orders': [{'id': 2, 'user_id': 2, 'status': 'pending', 'total': 25.0, 'items': [{'product_id': 5, 'name': 'Gadget', 'price': 25.0, 'quantity': 1}]}]}`
- `create_order_with_invalid_payload_sets_error`: When createOrder is called with an invalid payload (e.g. missing items), the hook should set error to a validation message and not update orders.
  - Input: `{'orderCreateRequest': {}}`
  - Expected: `{'orders': [], 'error': 'Validation error: items is required'}`
- `fetches_single_order_and_updates_selected_order_state`: When fetchOrderById is called with a valid order_id and the API returns a valid OrderResponse, the hook should update selectedOrder state.
  - Input: `{'order_id': 1, 'apiResponse': {'id': 1, 'user_id': 2, 'status': 'paid', 'total': 100.0, 'items': [{'product_id': 10, 'name': 'Widget', 'price': 50.0, 'quantity': 2}]}}`
  - Expected: `{'selectedOrder': {'id': 1, 'user_id': 2, 'status': 'paid', 'total': 100.0, 'items': [{'product_id': 10, 'name': 'Widget', 'price': 50.0, 'quantity': 2}]}, 'error': None}`
- `fetch_order_by_id_not_found_sets_error`: When fetchOrderById is called with a non-existent order_id and the API returns 404, the hook should set error to 'Order not found'.
  - Input: `{'order_id': 999, 'apiError': {'status': 404, 'message': 'Order not found'}}`
  - Expected: `{'selectedOrder': None, 'error': 'Order not found'}`
- `updates_order_status_and_reflects_in_orders_state`: When updateOrderStatus is called with a valid order_id and status, and the API returns the updated OrderResponse, the hook should update the order in orders state.
  - Input: `{'order_id': 1, 'status': 'shipped', 'apiResponse': {'id': 1, 'user_id': 2, 'status': 'shipped', 'total': 100.0, 'items': [{'product_id': 10, 'name': 'Widget', 'price': 50.0, 'quantity': 2}]}}`
  - Expected: `{'ordersUpdated': True, 'orders': [{'id': 1, 'user_id': 2, 'status': 'shipped', 'total': 100.0, 'items': [{'product_id': 10, 'name': 'Widget', 'price': 50.0, 'quantity': 2}]}]}`
- `update_order_status_with_invalid_status_sets_error`: When updateOrderStatus is called with an invalid status value, the hook should set error to a validation message and not update orders.
  - Input: `{'order_id': 1, 'status': 'invalid_status'}`
  - Expected: `{'error': 'Validation error: status must be one of pending, paid, shipped, cancelled'}`
- `handles_loading_state_during_fetch_orders`: While fetchOrders is in progress, loading should be true and revert to false after completion.
  - Expected: `{'loadingDuringFetch': True, 'loadingAfterFetch': False}`

### 🔴 TEST — Tests: backend/infrastructure/docker_orchestration.py
> Ref: §1.1 (modelos de `backend/infrastructure/docker_orchestration.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_docker_orchestration.py`

**Casos de prueba (implementar todos):**
- `test_docker_compose_up_starts_all_services`: Running docker-compose up must start all required services (auth, product, order, postgres, redis) and all must be healthy.
  - Expected: `{'services': ['auth-service', 'product-service', 'order-service', 'postgres', 'redis'], 'all_healthy': True}`
- `test_services_accessible_after_startup`: After docker-compose up, all API endpoints must be accessible and return 200 for health checks.
  - Expected: `{'endpoints': [{'url': 'http://localhost:8001/auth/health', 'status_code': 200}, {'url': 'http://localhost:8002/products/health', 'status_code': 200}, {'url': 'http://localhost:8003/orders/health', 'status_code': 200}]}`
- `test_docker_compose_down_removes_all_containers`: Running docker-compose down must remove all containers and networks created by the project.
  - Expected: `{'containers_removed': ['auth-service', 'product-service', 'order-service', 'postgres', 'redis'], 'networks_removed': True}`
- `test_missing_env_file_causes_startup_failure`: If required .env files are missing, docker-compose up must fail with a clear error message.
  - Input: `{'env_files_present': False}`
  - Expected: `{'startup_successful': False, 'error_message_contains': '.env'}`
- `test_invalid_dockerfile_fails_build_with_error`: If a Dockerfile is syntactically invalid, docker-compose build must fail and output a Dockerfile parse error.
  - Input: `{'dockerfile_invalid': True}`
  - Expected: `{'build_successful': False, 'error_message_contains': 'Dockerfile parse error'}`
- `test_documentation_includes_zero_manual_steps`: The README or setup documentation must include a single command for local setup with no manual steps required.
  - Expected: `{'documentation_contains': ['docker-compose up', 'no manual steps']}`
- `test_services_restart_on_crash`: If a service container crashes, Docker Compose must automatically restart it according to the restart policy.
  - Input: `{'crash_service': 'auth-service'}`
  - Expected: `{'service_restarted': 'auth-service', 'restart_policy_applied': True}`
- `test_postgres_and_redis_data_persistence`: Postgres and Redis containers must use Docker volumes for data persistence; data must persist across container restarts.
  - Input: `{'write_data': True, 'restart_containers': ['postgres', 'redis']}`
  - Expected: `{'data_persisted': True}`
- `test_docker_compose_logs_include_all_services`: docker-compose logs must include output from all services and show no critical errors on startup.
  - Expected: `{'logs_include': ['auth-service', 'product-service', 'order-service', 'postgres', 'redis'], 'no_critical_errors': True}`

### 🟢 PROD — Foundation — shared types, interfaces, DB schemas, config (1/2)
> Create all shared code and configuration required by backend and frontend services.
**Archivos:**
  - `backend/shared/models.py`  
  - `backend/shared/db.py`  
  - `backend/shared/jwt_utils.py`  
  - `frontend/src/types/auth.js`  
  - `frontend/src/types/product.js`  
  - `frontend/src/types/order.js`  
  - `frontend/src/api/auth.js`  
  - `frontend/src/api/product.js`  
  - `frontend/src/api/order.js`  
  - `frontend/src/hooks/useAuth.js`  
  - `frontend/src/hooks/useProducts.js`


### 🟢 PROD — Foundation — shared types, interfaces, DB schemas, config (2/2)
> Create all shared code and configuration required by backend and frontend services.
**Archivos:**
  - `frontend/src/hooks/useOrders.js`


## Wave 2

### 🔴 TEST — Tests: backend/auth-service/routes.py
> Ref: §1.1 (modelos de `backend/product-service/routes.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_routes.py`

**Casos de prueba (implementar todos):**
- `test_post_products_admin_success`: POST /products/ as admin with valid ProductCreateRequest returns 200 and ProductResponse
  - Input: `{'auth_role': 'admin', 'body': {'name': 'Route Product', 'description': 'Route test', 'price': 15.0, 'stock': 7}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock'], 'name': 'Route Product'}`
- `test_post_products_customer_forbidden`: POST /products/ as customer returns 403 Forbidden
  - Input: `{'auth_role': 'customer', 'body': {'name': 'Forbidden Product', 'description': 'Should fail', 'price': 10.0, 'stock': 1}}`
  - Expected: `{'status_code': 403}`
- `test_get_products_returns_list`: GET /products/ returns 200 and ProductListResponse with products array
  - Expected: `{'status_code': 200, 'fields': ['products']}`
- `test_get_product_by_id_not_found`: GET /products/{product_id} with nonexistent id returns 404
  - Input: `{'product_id': 9999}`
  - Expected: `{'status_code': 404}`
- `test_put_products_admin_success`: PUT /products/{product_id} as admin with valid ProductUpdateRequest updates and returns ProductResponse
  - Input: `{'auth_role': 'admin', 'product_id': 1, 'body': {'name': 'Updated Name', 'description': 'Updated Desc', 'price': 20.0, 'stock': 8}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock'], 'name': 'Updated Name'}`
- `test_put_products_customer_forbidden`: PUT /products/{product_id} as customer returns 403 Forbidden
  - Input: `{'auth_role': 'customer', 'product_id': 1, 'body': {'name': 'Should Not Update', 'description': 'No update', 'price': 10.0, 'stock': 1}}`
  - Expected: `{'status_code': 403}`
- `test_delete_products_admin_success`: DELETE /products/{product_id} as admin returns 200 and detail message
  - Input: `{'auth_role': 'admin', 'product_id': 1}`
  - Expected: `{'status_code': 200, 'fields': ['detail'], 'detail': 'Product deleted'}`
- `test_delete_products_customer_forbidden`: DELETE /products/{product_id} as customer returns 403 Forbidden
  - Input: `{'auth_role': 'customer', 'product_id': 1}`
  - Expected: `{'status_code': 403}`
- `test_post_products_missing_field_returns_422`: POST /products/ with missing required field returns 422 Unprocessable Entity
  - Input: `{'auth_role': 'admin', 'body': {'name': 'Missing Price', 'description': 'No price', 'stock': 5}}`
  - Expected: `{'status_code': 422}`

### 🔴 TEST — Tests: backend/auth-service/crud.py
> Ref: §1.1 (modelos de `backend/product-service/crud.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_crud.py`

**Casos de prueba (implementar todos):**
- `test_create_product_success`: create_product should create and return a new product with correct fields
  - Input: `{'product_data': {'name': 'CRUD Product', 'description': 'CRUD test', 'price': 12.5, 'stock': 3}}`
  - Expected: `{'fields': ['id', 'name', 'description', 'price', 'stock'], 'name': 'CRUD Product'}`
- `test_update_product_not_found`: update_product should raise exception if product_id does not exist
  - Input: `{'product_id': 9999, 'update_data': {'name': 'Updated', 'description': 'Updated', 'price': 1.0, 'stock': 1}}`
  - Expected: `{'raises': 'ProductNotFound'}`
- `test_delete_product_success`: delete_product should remove product and subsequent get should raise ProductNotFound
  - Input: `{'product_data': {'name': 'To Delete', 'description': 'Delete me', 'price': 2.0, 'stock': 1}}`
  - Expected: `{'deleted': True, 'raises_on_get': 'ProductNotFound'}`

### 🔴 TEST — Tests: backend/auth-service/models.py
> Ref: §1.1 (modelos de `backend/product-service/models.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_models.py`

**Casos de prueba (implementar todos):**
- `test_product_create_request_valid_data`: ProductCreateRequest should accept valid name, description, price, and stock
  - Input: `{'name': 'Test Product', 'description': 'A test product', 'price': 19.99, 'stock': 10}`
  - Expected: `{'valid': True}`
- `test_product_create_request_invalid_price_type`: ProductCreateRequest should raise validation error if price is not a number
  - Input: `{'name': 'Test Product', 'description': 'A test product', 'price': 'not-a-number', 'stock': 10}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_product_create_request_missing_required_field`: ProductCreateRequest should raise validation error if a required field is missing
  - Input: `{'name': 'Test Product', 'description': 'A test product', 'price': 19.99}`
  - Expected: `{'raises': 'ValidationError'}`

### 🔴 TEST — Tests: backend/auth-service/dependencies.py
> Ref: §1.1 (modelos de `backend/product-service/dependencies.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_dependencies.py`

**Casos de prueba (implementar todos):**
- `test_jwt_auth_valid_token`: Dependency should allow access with valid JWT token and correct role
  - Input: `{'token': 'valid_admin_jwt', 'required_role': 'admin'}`
  - Expected: `{'authorized': True}`
- `test_jwt_auth_invalid_token`: Dependency should raise HTTPException 401 for invalid JWT token
  - Input: `{'token': 'invalid_jwt', 'required_role': 'admin'}`
  - Expected: `{'raises': 'HTTPException', 'status_code': 401}`
- `test_jwt_auth_insufficient_role`: Dependency should raise HTTPException 403 if user role does not match required role
  - Input: `{'token': 'valid_customer_jwt', 'required_role': 'admin'}`
  - Expected: `{'raises': 'HTTPException', 'status_code': 403}`

### 🔴 TEST — Tests: backend/auth-service/main.py
> Ref: §1.1 (modelos de `backend/product-service/main.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_main.py`

**Casos de prueba (implementar todos):**
- `test_health_check_returns_200`: GET /health should return 200 OK with expected health status
  - Expected: `{'status_code': 200, 'fields': ['status']}`
- `test_cors_headers_present_on_response`: All endpoints should include CORS headers in the response
  - Expected: `{'headers': ['access-control-allow-origin']}`
- `test_startup_event_validates_env_vars`: App startup should fail if required environment variables are missing or invalid
  - Input: `{'env': {'DATABASE_URL': ''}}`
  - Expected: `{'raises': 'EnvironmentError'}`

### 🔴 TEST — Tests: backend/product-service/main.py
> Ref: §1.1 (modelos de `backend/product-service/main.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_main.py`

**Casos de prueba (implementar todos):**
- `test_health_check_returns_200`: GET /health should return 200 OK with expected health status
  - Expected: `{'status_code': 200, 'fields': ['status']}`
- `test_cors_headers_present_on_response`: All endpoints should include CORS headers in the response
  - Expected: `{'headers': ['access-control-allow-origin']}`
- `test_startup_event_validates_env_vars`: App startup should fail if required environment variables are missing or invalid
  - Input: `{'env': {'DATABASE_URL': ''}}`
  - Expected: `{'raises': 'EnvironmentError'}`

### 🔴 TEST — Tests: backend/product-service/models.py
> Ref: §1.1 (modelos de `backend/product-service/models.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_models.py`

**Casos de prueba (implementar todos):**
- `test_product_create_request_valid_data`: ProductCreateRequest should accept valid name, description, price, and stock
  - Input: `{'name': 'Test Product', 'description': 'A test product', 'price': 19.99, 'stock': 10}`
  - Expected: `{'valid': True}`
- `test_product_create_request_invalid_price_type`: ProductCreateRequest should raise validation error if price is not a number
  - Input: `{'name': 'Test Product', 'description': 'A test product', 'price': 'not-a-number', 'stock': 10}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_product_create_request_missing_required_field`: ProductCreateRequest should raise validation error if a required field is missing
  - Input: `{'name': 'Test Product', 'description': 'A test product', 'price': 19.99}`
  - Expected: `{'raises': 'ValidationError'}`

### 🔴 TEST — Tests: backend/product-service/db.py
> Ref: §1.1 (modelos de `backend/product-service/db.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_db.py`

**Casos de prueba (implementar todos):**
- `test_product_model_persistence`: Product SQLAlchemy model should persist and retrieve data correctly in SQLite in-memory DB
  - Input: `{'product': {'name': 'DB Product', 'description': 'Persisted product', 'price': 9.99, 'stock': 5}}`
  - Expected: `{'fields': ['id', 'name', 'description', 'price', 'stock'], 'name': 'DB Product'}`
- `test_product_model_negative_stock`: Product model should not allow negative stock values
  - Input: `{'product': {'name': 'Negative Stock', 'description': 'Invalid stock', 'price': 5.0, 'stock': -1}}`
  - Expected: `{'raises': 'IntegrityError'}`
- `test_product_model_large_price`: Product model should handle large price values within max_digits=10, decimal_places=2
  - Input: `{'product': {'name': 'Expensive Product', 'description': 'High price', 'price': 99999999.99, 'stock': 1}}`
  - Expected: `{'valid': True}`

### 🔴 TEST — Tests: backend/product-service/crud.py
> Ref: §1.1 (modelos de `backend/product-service/crud.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_crud.py`

**Casos de prueba (implementar todos):**
- `test_create_product_success`: create_product should create and return a new product with correct fields
  - Input: `{'product_data': {'name': 'CRUD Product', 'description': 'CRUD test', 'price': 12.5, 'stock': 3}}`
  - Expected: `{'fields': ['id', 'name', 'description', 'price', 'stock'], 'name': 'CRUD Product'}`
- `test_update_product_not_found`: update_product should raise exception if product_id does not exist
  - Input: `{'product_id': 9999, 'update_data': {'name': 'Updated', 'description': 'Updated', 'price': 1.0, 'stock': 1}}`
  - Expected: `{'raises': 'ProductNotFound'}`
- `test_delete_product_success`: delete_product should remove product and subsequent get should raise ProductNotFound
  - Input: `{'product_data': {'name': 'To Delete', 'description': 'Delete me', 'price': 2.0, 'stock': 1}}`
  - Expected: `{'deleted': True, 'raises_on_get': 'ProductNotFound'}`

### 🔴 TEST — Tests: backend/product-service/routes.py
> Ref: §1.1 (modelos de `backend/product-service/routes.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_routes.py`

**Casos de prueba (implementar todos):**
- `test_post_products_admin_success`: POST /products/ as admin with valid ProductCreateRequest returns 200 and ProductResponse
  - Input: `{'auth_role': 'admin', 'body': {'name': 'Route Product', 'description': 'Route test', 'price': 15.0, 'stock': 7}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock'], 'name': 'Route Product'}`
- `test_post_products_customer_forbidden`: POST /products/ as customer returns 403 Forbidden
  - Input: `{'auth_role': 'customer', 'body': {'name': 'Forbidden Product', 'description': 'Should fail', 'price': 10.0, 'stock': 1}}`
  - Expected: `{'status_code': 403}`
- `test_get_products_returns_list`: GET /products/ returns 200 and ProductListResponse with products array
  - Expected: `{'status_code': 200, 'fields': ['products']}`
- `test_get_product_by_id_not_found`: GET /products/{product_id} with nonexistent id returns 404
  - Input: `{'product_id': 9999}`
  - Expected: `{'status_code': 404}`
- `test_put_products_admin_success`: PUT /products/{product_id} as admin with valid ProductUpdateRequest updates and returns ProductResponse
  - Input: `{'auth_role': 'admin', 'product_id': 1, 'body': {'name': 'Updated Name', 'description': 'Updated Desc', 'price': 20.0, 'stock': 8}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock'], 'name': 'Updated Name'}`
- `test_put_products_customer_forbidden`: PUT /products/{product_id} as customer returns 403 Forbidden
  - Input: `{'auth_role': 'customer', 'product_id': 1, 'body': {'name': 'Should Not Update', 'description': 'No update', 'price': 10.0, 'stock': 1}}`
  - Expected: `{'status_code': 403}`
- `test_delete_products_admin_success`: DELETE /products/{product_id} as admin returns 200 and detail message
  - Input: `{'auth_role': 'admin', 'product_id': 1}`
  - Expected: `{'status_code': 200, 'fields': ['detail'], 'detail': 'Product deleted'}`
- `test_delete_products_customer_forbidden`: DELETE /products/{product_id} as customer returns 403 Forbidden
  - Input: `{'auth_role': 'customer', 'product_id': 1}`
  - Expected: `{'status_code': 403}`
- `test_post_products_missing_field_returns_422`: POST /products/ with missing required field returns 422 Unprocessable Entity
  - Input: `{'auth_role': 'admin', 'body': {'name': 'Missing Price', 'description': 'No price', 'stock': 5}}`
  - Expected: `{'status_code': 422}`

### 🔴 TEST — Tests: backend/product-service/dependencies.py
> Ref: §1.1 (modelos de `backend/product-service/dependencies.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_dependencies.py`

**Casos de prueba (implementar todos):**
- `test_jwt_auth_valid_token`: Dependency should allow access with valid JWT token and correct role
  - Input: `{'token': 'valid_admin_jwt', 'required_role': 'admin'}`
  - Expected: `{'authorized': True}`
- `test_jwt_auth_invalid_token`: Dependency should raise HTTPException 401 for invalid JWT token
  - Input: `{'token': 'invalid_jwt', 'required_role': 'admin'}`
  - Expected: `{'raises': 'HTTPException', 'status_code': 401}`
- `test_jwt_auth_insufficient_role`: Dependency should raise HTTPException 403 if user role does not match required role
  - Input: `{'token': 'valid_customer_jwt', 'required_role': 'admin'}`
  - Expected: `{'raises': 'HTTPException', 'status_code': 403}`

### 🔴 TEST — Tests: frontend/vite.config.js
> Ref: §1.1 (modelos de `frontend/vite.config.js`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/vite.config.test.jsx`

**Casos de prueba (implementar todos):**
- `loads environment variables from .env files`: Vite config should correctly load environment variables from .env files and expose them to import.meta.env.
  - Input: `{'env': {'VITE_API_URL': 'http://localhost:8000', 'VITE_FEATURE_FLAG': 'true'}}`
  - Expected: `{'import.meta.env.VITE_API_URL': 'http://localhost:8000', 'import.meta.env.VITE_FEATURE_FLAG': 'true'}`
- `throws error for missing required env vars`: Vite config should throw or log an error if a required environment variable (e.g. VITE_API_URL) is missing.
  - Input: `{'env': {}}`
  - Expected: `{'error': 'VITE_API_URL is not defined'}`
- `supports custom base path configuration`: Vite config should allow setting a custom base path via environment variable (VITE_BASE).
  - Input: `{'env': {'VITE_BASE': '/shop/'}}`
  - Expected: `{'config.base': '/shop/'}`

### 🔴 TEST — Tests: frontend/index.html
> Ref: §1.1 (modelos de `frontend/index.html`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/index.test.jsx`

**Casos de prueba (implementar todos):**
- `renders root div with id root`: index.html must contain a <div id="root"></div> as the React mount point.
  - Expected: `{'selector': 'div#root', 'exists': True}`
- `includes Vite script injection`: index.html should include the Vite script tag for main.jsx (e.g. <script type="module" src="/src/main.jsx"></script>).
  - Expected: `{'selector': "script[type='module'][src='/src/main.jsx']", 'exists': True}`
- `sets correct meta charset and viewport`: index.html should include <meta charset="UTF-8"> and <meta name="viewport" content="width=device-width, initial-scale=1.0">.
  - Expected: `{'meta.charset': 'UTF-8', 'meta.viewport': 'width=device-width, initial-scale=1.0'}`

### 🔴 TEST — Tests: frontend/src/main.jsx
> Ref: §1.1 (modelos de `frontend/src/main.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/main.test.jsx`

**Casos de prueba (implementar todos):**
- `renders App component into root div`: main.jsx should render the App component into the element with id 'root'.
  - Expected: `{'renderedComponent': 'App', 'containerId': 'root'}`
- `throws error if root div is missing`: main.jsx should throw or log an error if the root div is not present in the DOM.
  - Input: `{'document.body': '<body></body>'}`
  - Expected: `{'error': "No element with id 'root' found"}`
- `supports React.StrictMode wrapping`: main.jsx should wrap App in React.StrictMode for development builds.
  - Expected: `{'strictMode': True}`

### 🔴 TEST — Tests: frontend/src/App.jsx
> Ref: §1.1 (modelos de `frontend/src/App.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/App.test.jsx`

**Casos de prueba (implementar todos):**
- `renders header and footer layout`: App.jsx should render the Header and Footer components on all routes.
  - Expected: `{'components': ['Header', 'Footer'], 'present': True}`
- `renders child routes via Outlet`: App.jsx should render child routes using React Router's Outlet.
  - Expected: `{'component': 'Outlet', 'present': True}`
- `displays error boundary on error`: App.jsx should display an error boundary UI if a child throws.
  - Input: `{'childThrows': True}`
  - Expected: `{'errorBoundaryDisplayed': True}`

### 🔴 TEST — Tests: frontend/src/router.jsx
> Ref: §1.1 (modelos de `frontend/src/router.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/router.test.jsx`

**Casos de prueba (implementar todos):**
- `redirects unauthenticated user from protected route to login`: If user is not authenticated, navigating to a protected route should redirect to /login.
  - Input: `{'route': '/orders', 'auth': None}`
  - Expected: `{'redirect': '/login'}`
- `allows admin user to access admin route`: If user has role 'admin', navigating to an admin route should render the admin page.
  - Input: `{'route': '/admin/products', 'auth': {'role': 'admin'}}`
  - Expected: `{'componentRendered': 'AdminProductsPage'}`
- `denies customer user access to admin route`: If user has role 'customer', navigating to an admin route should redirect to /unauthorized or home.
  - Input: `{'route': '/admin/products', 'auth': {'role': 'customer'}}`
  - Expected: `{'redirect': '/unauthorized'}`

### 🔴 TEST — Tests: frontend/src/components/Layout/Header.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Layout/Header.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Layout/Header.test.jsx`

**Casos de prueba (implementar todos):**
- `renders logo and navigation links`: Header should display the site logo and navigation links (e.g. Home, Products, Login/Register or UserMenu).
  - Expected: `{'elements': ['logo', 'nav-links'], 'present': True}`
- `shows UserMenu when authenticated`: Header should display the UserMenu component when user is authenticated.
  - Input: `{'auth': {'email': 'user@test.com', 'role': 'customer'}}`
  - Expected: `{'componentRendered': 'UserMenu'}`
- `shows Login/Register links when not authenticated`: Header should display Login and Register links when user is not authenticated.
  - Input: `{'auth': None}`
  - Expected: `{'elements': ['login-link', 'register-link'], 'present': True}`

### 🔴 TEST — Tests: frontend/src/components/Layout/Footer.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Layout/Footer.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Layout/Footer.test.jsx`

**Casos de prueba (implementar todos):**
- `renders copyright`: Footer should display copyright information.
  - Expected: `{'textContent': '©'}`
- `renders links to privacy and terms`: Footer should include links to privacy policy and terms of service.
  - Expected: `{'elements': ['privacy-link', 'terms-link'], 'present': True}`
- `renders consistently across routes`: Footer should be present on all main routes.
  - Input: `{'routes': ['/', '/products', '/login']}`
  - Expected: `{'componentRendered': 'Footer', 'present': True}`

### 🔴 TEST — Tests: frontend/src/components/Auth/LoginForm.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Auth/LoginForm.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Auth/LoginForm.test.jsx`

**Casos de prueba (implementar todos):**
- `submits valid credentials and calls login API`: LoginForm should call POST /auth/login with email and password and handle TokenResponse on success.
  - Input: `{'form': {'email': 'user@test.com', 'password': 'ValidPass123'}}`
  - Expected: `{'apiCalled': '/auth/login', 'requestBody': {'email': 'user@test.com', 'password': 'ValidPass123'}, 'responseFields': ['access_token', 'refresh_token', 'token_type'], 'status_code': 200}`
- `shows validation error for missing email`: LoginForm should display a validation error if email is missing.
  - Input: `{'form': {'email': '', 'password': 'ValidPass123'}}`
  - Expected: `{'validationError': 'Email is required'}`
- `shows error message on 401 Unauthorized`: LoginForm should display an error message if the API returns 401 Unauthorized.
  - Input: `{'form': {'email': 'user@test.com', 'password': 'wrong'}, 'apiResponse': {'status_code': 401, 'body': {'detail': 'Invalid credentials'}}}`
  - Expected: `{'errorDisplayed': 'Invalid credentials'}`

### 🔴 TEST — Tests: frontend/src/components/Auth/RegisterForm.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Auth/RegisterForm.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Auth/RegisterForm.test.jsx`

**Casos de prueba (implementar todos):**
- `submits valid registration and calls register API`: RegisterForm should call POST /auth/register with email, password, and name and handle UserResponse on success.
  - Input: `{'form': {'email': 'newuser@test.com', 'password': 'StrongPass123', 'name': 'New User'}}`
  - Expected: `{'apiCalled': '/auth/register', 'requestBody': {'email': 'newuser@test.com', 'password': 'StrongPass123', 'name': 'New User'}, 'responseFields': ['id', 'email', 'name', 'role'], 'status_code': 200}`
- `shows validation error for missing password`: RegisterForm should display a validation error if password is missing.
  - Input: `{'form': {'email': 'newuser@test.com', 'password': '', 'name': 'New User'}}`
  - Expected: `{'validationError': 'Password is required'}`
- `shows API error for duplicate email`: RegisterForm should display an error message if the API returns an error for duplicate email.
  - Input: `{'form': {'email': 'existing@test.com', 'password': 'StrongPass123', 'name': 'Existing User'}, 'apiResponse': {'status_code': 400, 'body': {'detail': 'Email already registered'}}}`
  - Expected: `{'errorDisplayed': 'Email already registered'}`

### 🔴 TEST — Tests: frontend/src/components/Auth/UserMenu.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Auth/UserMenu.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Auth/UserMenu.test.jsx`

**Casos de prueba (implementar todos):**
- `displays user email and logout option`: UserMenu should display the authenticated user's email and a logout button.
  - Input: `{'auth': {'email': 'user@test.com', 'name': 'User', 'role': 'customer'}}`
  - Expected: `{'elements': ['user-email', 'logout-button'], 'present': True}`
- `calls logout handler on logout click`: UserMenu should call the logout handler and clear tokens when logout is clicked.
  - Input: `{'logoutClick': True}`
  - Expected: `{'logoutHandlerCalled': True, 'tokensCleared': True}`
- `shows admin link for admin users`: UserMenu should display an admin dashboard link if user role is 'admin'.
  - Input: `{'auth': {'role': 'admin'}}`
  - Expected: `{'elements': ['admin-dashboard-link'], 'present': True}`

### 🔴 TEST — Tests: frontend/src/pages/Login.jsx
> Ref: §1.1 (modelos de `frontend/src/pages/Login.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/pages/Login.test.jsx`

**Casos de prueba (implementar todos):**
- `renders LoginForm component`: Login page should render the LoginForm component.
  - Expected: `{'componentRendered': 'LoginForm'}`
- `redirects to home if already authenticated`: Login page should redirect to home (/) if user is already authenticated.
  - Input: `{'auth': {'email': 'user@test.com'}}`
  - Expected: `{'redirect': '/'}`
- `shows error message from location state`: Login page should display an error message if redirected with an error in location state.
  - Input: `{'locationState': {'error': 'Session expired'}}`
  - Expected: `{'errorDisplayed': 'Session expired'}`

### 🔴 TEST — Tests: frontend/src/pages/Register.jsx
> Ref: §1.1 (modelos de `frontend/src/pages/Register.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/pages/Register.test.jsx`

**Casos de prueba (implementar todos):**
- `renders RegisterForm component`: Register page should render the RegisterForm component.
  - Expected: `{'componentRendered': 'RegisterForm'}`
- `redirects to home if already authenticated`: Register page should redirect to home (/) if user is already authenticated.
  - Input: `{'auth': {'email': 'user@test.com'}}`
  - Expected: `{'redirect': '/'}`
- `shows error message from location state`: Register page should display an error message if redirected with an error in location state.
  - Input: `{'locationState': {'error': 'Registration failed'}}`
  - Expected: `{'errorDisplayed': 'Registration failed'}`

### 🔴 TEST — Tests: frontend/src/components/Product/ProductList.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Product/ProductList.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Product/ProductList.test.jsx`

**Casos de prueba (implementar todos):**
- `renders_product_grid_with_products`: Should render a grid/list of products when given a ProductListResponse with multiple products.
  - Input: `{'products': [{'id': 1, 'name': 'Shirt', 'description': 'Cotton shirt', 'price': 19.99, 'stock': 10}, {'id': 2, 'name': 'Pants', 'description': 'Denim pants', 'price': 39.99, 'stock': 5}]}`
  - Expected: `{'rendered_product_names': ['Shirt', 'Pants']}`
- `renders_empty_state_when_no_products`: Should render an empty state message when ProductListResponse.products is an empty array.
  - Input: `{'products': []}`
  - Expected: `{'empty_state_displayed': True}`
- `displays_error_message_on_fetch_failure`: Should display an error message if fetching products fails (e.g. network error or 500).
  - Input: `{'api_error': True}`
  - Expected: `{'error_message_displayed': True}`

### 🔴 TEST — Tests: frontend/src/components/Product/ProductForm.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Product/ProductForm.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Product/ProductForm.test.jsx`

**Casos de prueba (implementar todos):**
- `submits_valid_product_create_form`: Should submit ProductCreateRequest with valid fields and call onSuccess callback on 200 response.
  - Input: `{'form': {'name': 'Hat', 'description': 'Wool hat', 'price': 12.5, 'stock': 20}}`
  - Expected: `{'api_called_with': {'name': 'Hat', 'description': 'Wool hat', 'price': 12.5, 'stock': 20}, 'onSuccess_called': True}`
- `shows_validation_error_for_missing_name`: Should display validation error if the name field is empty on submit.
  - Input: `{'form': {'name': '', 'description': 'Wool hat', 'price': 12.5, 'stock': 20}}`
  - Expected: `{'validation_error_fields': ['name']}`
- `shows_api_error_on_unauthorized`: Should display an error message if API returns 401 Unauthorized when submitting the form.
  - Input: `{'form': {'name': 'Hat', 'description': 'Wool hat', 'price': 12.5, 'stock': 20}, 'api_response_status': 401}`
  - Expected: `{'error_message_displayed': True}`

### 🔴 TEST — Tests: frontend/src/components/Product/ProductDetail.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Product/ProductDetail.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Product/ProductDetail.test.jsx`

**Casos de prueba (implementar todos):**
- `renders_product_details`: Should render all fields of ProductResponse (name, description, price, stock) for a valid product.
  - Input: `{'product': {'id': 3, 'name': 'Jacket', 'description': 'Leather jacket', 'price': 99.99, 'stock': 2}}`
  - Expected: `{'fields_rendered': ['Jacket', 'Leather jacket', '99.99', '2']}`
- `shows_not_found_for_invalid_product_id`: Should display a not found message if API returns 404 for the product.
  - Input: `{'product_id': 999, 'api_response_status': 404}`
  - Expected: `{'not_found_message_displayed': True}`
- `shows_loading_state_while_fetching`: Should display a loading indicator while product details are being fetched.
  - Input: `{'loading': True}`
  - Expected: `{'loading_indicator_displayed': True}`

### 🔴 TEST — Tests: frontend/src/components/Order/OrderList.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Order/OrderList.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Order/OrderList.test.jsx`

**Casos de prueba (implementar todos):**
- `renders_order_list_for_customer`: Should render a list of orders for a customer using OrderListResponse.
  - Input: `{'orders': [{'id': 1, 'user_id': 10, 'status': 'paid', 'total': 59.98, 'items': [{'product_id': 1, 'name': 'Shirt', 'price': 19.99, 'quantity': 2}]}]}`
  - Expected: `{'order_ids_rendered': [1]}`
- `renders_empty_state_when_no_orders`: Should render an empty state message when OrderListResponse.orders is empty.
  - Input: `{'orders': []}`
  - Expected: `{'empty_state_displayed': True}`
- `shows_error_message_on_fetch_failure`: Should display an error message if fetching orders fails (e.g. 401 Unauthorized or 500).
  - Input: `{'api_error': True}`
  - Expected: `{'error_message_displayed': True}`

### 🔴 TEST — Tests: frontend/src/components/Order/OrderForm.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Order/OrderForm.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Order/OrderForm.test.jsx`

**Casos de prueba (implementar todos):**
- `submits_valid_order_create_form`: Should submit OrderCreateRequest with valid items and call onSuccess callback on 200 response.
  - Input: `{'form': {'items': [{'product_id': 1, 'quantity': 2}, {'product_id': 2, 'quantity': 1}]}}`
  - Expected: `{'api_called_with': {'items': [{'product_id': 1, 'quantity': 2}, {'product_id': 2, 'quantity': 1}]}, 'onSuccess_called': True}`
- `shows_validation_error_for_empty_items`: Should display validation error if items array is empty on submit.
  - Input: `{'form': {'items': []}}`
  - Expected: `{'validation_error_fields': ['items']}`
- `shows_api_error_on_unauthorized`: Should display an error message if API returns 401 Unauthorized when submitting the order.
  - Input: `{'form': {'items': [{'product_id': 1, 'quantity': 2}]}, 'api_response_status': 401}`
  - Expected: `{'error_message_displayed': True}`

### 🔴 TEST — Tests: frontend/src/components/Order/OrderDetail.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Order/OrderDetail.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Order/OrderDetail.test.jsx`

**Casos de prueba (implementar todos):**
- `renders_order_details`: Should render all fields of OrderResponse (id, status, total, items) for a valid order.
  - Input: `{'order': {'id': 5, 'user_id': 10, 'status': 'shipped', 'total': 120.0, 'items': [{'product_id': 1, 'name': 'Shirt', 'price': 20.0, 'quantity': 2}]}}`
  - Expected: `{'fields_rendered': ['5', 'shipped', '120.00', 'Shirt', '20.00', '2']}`
- `shows_not_found_for_invalid_order_id`: Should display a not found message if API returns 404 for the order.
  - Input: `{'order_id': 999, 'api_response_status': 404}`
  - Expected: `{'not_found_message_displayed': True}`
- `shows_loading_state_while_fetching`: Should display a loading indicator while order details are being fetched.
  - Input: `{'loading': True}`
  - Expected: `{'loading_indicator_displayed': True}`

### 🔴 TEST — Tests: frontend/src/pages/Home.jsx
> Ref: §1.1 (modelos de `frontend/src/pages/Home.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/pages/Home.test.jsx`

**Casos de prueba (implementar todos):**
- `renders_landing_page_content`: Should render the main landing page content including welcome message and featured products.
  - Expected: `{'landing_content_displayed': True}`
- `shows_featured_products_if_available`: Should display featured products section if featured products are provided.
  - Input: `{'featured_products': [{'id': 1, 'name': 'Shirt', 'description': 'Cotton shirt', 'price': 19.99, 'stock': 10}]}`
  - Expected: `{'featured_products_displayed': True}`
- `handles_no_featured_products_gracefully`: Should not throw or break if featured products array is empty.
  - Input: `{'featured_products': []}`
  - Expected: `{'no_featured_products_error': False}`

### 🔴 TEST — Tests: frontend/src/pages/Products.jsx
> Ref: §1.1 (modelos de `frontend/src/pages/Products.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/pages/Products.test.jsx`

**Casos de prueba (implementar todos):**
- `renders_product_listing_page`: Should render the product listing page and display ProductList component.
  - Expected: `{'product_list_component_rendered': True}`
- `shows_error_message_on_products_fetch_failure`: Should display an error message if fetching products fails (e.g. 500).
  - Input: `{'api_error': True}`
  - Expected: `{'error_message_displayed': True}`
- `renders_empty_state_when_no_products`: Should render an empty state if there are no products to display.
  - Input: `{'products': []}`
  - Expected: `{'empty_state_displayed': True}`

### 🔴 TEST — Tests: frontend/src/pages/ProductEdit.jsx
> Ref: §1.1 (modelos de `frontend/src/pages/ProductEdit.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/pages/ProductEdit.test.jsx`

**Casos de prueba (implementar todos):**
- `renders_product_form_for_create`: Should render ProductForm in create mode when no product_id is provided.
  - Input: `{'product_id': None}`
  - Expected: `{'product_form_mode': 'create'}`
- `renders_product_form_for_edit_with_prefilled_data`: Should render ProductForm in edit mode with prefilled data when product_id is provided.
  - Input: `{'product_id': 2, 'product_data': {'id': 2, 'name': 'Pants', 'description': 'Denim pants', 'price': 39.99, 'stock': 5}}`
  - Expected: `{'product_form_mode': 'edit', 'form_prefilled_with': {'name': 'Pants', 'description': 'Denim pants', 'price': 39.99, 'stock': 5}}`
- `shows_not_found_for_invalid_product_id`: Should display a not found message if API returns 404 for the product to edit.
  - Input: `{'product_id': 999, 'api_response_status': 404}`
  - Expected: `{'not_found_message_displayed': True}`

### 🔴 TEST — Tests: frontend/src/pages/Orders.jsx
> Ref: §1.1 (modelos de `frontend/src/pages/Orders.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/pages/Orders.test.jsx`

**Casos de prueba (implementar todos):**
- `renders_order_list_for_user`: Should render OrderList component for the current user.
  - Expected: `{'order_list_component_rendered': True}`
- `shows_error_message_on_orders_fetch_failure`: Should display an error message if fetching orders fails (e.g. 401 Unauthorized).
  - Input: `{'api_error': True}`
  - Expected: `{'error_message_displayed': True}`
- `renders_empty_state_when_no_orders`: Should render an empty state if there are no orders to display.
  - Input: `{'orders': []}`
  - Expected: `{'empty_state_displayed': True}`

### 🔴 TEST — Tests: frontend/src/pages/OrderDetail.jsx
> Ref: §1.1 (modelos de `frontend/src/pages/OrderDetail.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/pages/OrderDetail.test.jsx`

**Casos de prueba (implementar todos):**
- `renders order details for valid order_id`: When given a valid order_id, fetches order data from /orders/{order_id} and displays id, status, total, and items with product_id, name, price, and quantity.
  - Input: `{'order_id': 123, 'auth_token': 'valid_customer_token'}`
  - Expected: `{'api_called': '/orders/123', 'status_code': 200, 'fields_displayed': ['id', 'status', 'total', 'items[0].product_id', 'items[0].name', 'items[0].price', 'items[0].quantity']}`
- `shows loading indicator while fetching order`: Displays a loading spinner or message while the order data is being fetched from the API.
  - Input: `{'order_id': 123}`
  - Expected: `{'loading_indicator_visible': True}`
- `shows error message for unauthorized access`: If the user is not authenticated or not the owner/admin, displays an error message when API returns 401 or 403.
  - Input: `{'order_id': 123, 'auth_token': 'invalid_or_missing'}`
  - Expected: `{'api_called': '/orders/123', 'status_code': [401, 403], 'error_message_displayed': True}`
- `shows not found message for invalid order_id`: If the API returns 404 for a non-existent order_id, displays a not found message.
  - Input: `{'order_id': 99999, 'auth_token': 'valid_customer_token'}`
  - Expected: `{'api_called': '/orders/99999', 'status_code': 404, 'not_found_message_displayed': True}`
- `handles API/network error gracefully`: If the API call fails due to network or server error, displays a generic error message.
  - Input: `{'order_id': 123, 'auth_token': 'valid_customer_token'}`
  - Expected: `{'api_called': '/orders/123', 'status_code': 500, 'error_message_displayed': True}`
- `does not show order details if items array is empty`: If the order's items array is empty, displays a message indicating no items in the order.
  - Input: `{'order_response': {'id': 123, 'user_id': 1, 'status': 'pending', 'total': 0, 'items': []}}`
  - Expected: `{'no_items_message_displayed': True}`
- `displays correct status and total formatting`: Order status is displayed as a human-readable string and total is formatted as currency.
  - Input: `{'order_response': {'id': 123, 'user_id': 1, 'status': 'paid', 'total': 123.45, 'items': [{'product_id': 1, 'name': 'Widget', 'price': 123.45, 'quantity': 1}]}}`
  - Expected: `{'status_displayed': 'Paid', 'total_displayed': '$123.45'}`

### 🔴 TEST — Tests: frontend/src/pages/AdminDashboard.jsx
> Ref: §1.1 (modelos de `frontend/src/pages/AdminDashboard.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/pages/AdminDashboard.test.jsx`

**Casos de prueba (implementar todos):**
- `renders product and order lists for admin user`: When logged in as admin, fetches and displays product list from /products/ and order list from /orders/.
  - Input: `{'auth_token': 'valid_admin_token'}`
  - Expected: `{'api_called': ['/products/', '/orders/'], 'status_code': 200, 'fields_displayed': ['products[0].id', 'products[0].name', 'products[0].price', 'products[0].stock', 'orders[0].id', 'orders[0].status', 'orders[0].total']}`
- `shows unauthorized message for non-admin user`: If a non-admin user accesses the dashboard, displays an unauthorized error message.
  - Input: `{'auth_token': 'valid_customer_token'}`
  - Expected: `{'api_called': ['/products/', '/orders/'], 'status_code': [403, 401], 'unauthorized_message_displayed': True}`
- `shows loading indicators while fetching data`: Displays loading indicators for products and orders while API requests are in progress.
  - Expected: `{'loading_indicator_products': True, 'loading_indicator_orders': True}`
- `handles empty product and order lists`: If the API returns empty arrays for products or orders, displays appropriate empty state messages.
  - Input: `{'products_response': {'products': []}, 'orders_response': {'orders': []}}`
  - Expected: `{'empty_products_message_displayed': True, 'empty_orders_message_displayed': True}`
- `handles API/network errors gracefully`: If fetching products or orders fails, displays a generic error message for each section.
  - Input: `{'auth_token': 'valid_admin_token'}`
  - Expected: `{'api_called': ['/products/', '/orders/'], 'status_code': 500, 'error_message_displayed': True}`
- `allows admin to delete a product and updates list`: When admin clicks delete on a product, sends DELETE /products/{product_id}, removes product from list, and shows success message.
  - Input: `{'auth_token': 'valid_admin_token', 'product_id': 42}`
  - Expected: `{'api_called': '/products/42', 'method': 'DELETE', 'status_code': 200, 'product_removed_from_list': True, 'success_message_displayed': True}`
- `shows error if deleting product fails`: If DELETE /products/{product_id} fails, displays an error message and does not remove product from list.
  - Input: `{'auth_token': 'valid_admin_token', 'product_id': 42}`
  - Expected: `{'api_called': '/products/42', 'method': 'DELETE', 'status_code': 500, 'error_message_displayed': True, 'product_removed_from_list': False}`
- `allows admin to update order status and reflects change`: When admin updates an order's status, sends PUT /orders/{order_id}/status and updates the order status in the list.
  - Input: `{'auth_token': 'valid_admin_token', 'order_id': 101, 'new_status': 'shipped'}`
  - Expected: `{'api_called': '/orders/101/status', 'method': 'PUT', 'body': {'status': 'shipped'}, 'status_code': 200, 'order_status_updated_in_list': True}`
- `shows validation error if updating order status with invalid value`: If admin tries to set an invalid status value, displays a validation error and does not send API request.
  - Input: `{'order_id': 101, 'new_status': 'invalid_status'}`
  - Expected: `{'validation_error_displayed': True, 'api_called': False}`

### 🟢 PROD — Auth Service — registration, login, JWT, profile, logout
> Implement the Auth Service (FastAPI, SQLAlchemy, Alembic, PostgreSQL, Redis) with endpoints:
**Archivos:**
  - `backend/auth-service/main.py`  
  - `backend/auth-service/models.py`  
  - `backend/auth-service/db.py`  
  - `backend/auth-service/crud.py`  
  - `backend/auth-service/routes.py`  
  - `backend/auth-service/dependencies.py`  
  - `backend/auth-service/alembic.ini`


### 🟢 PROD — Product Service — categories, products, reviews, search/filter
> Implement the Product Service (FastAPI, SQLAlchemy, Alembic, PostgreSQL) with endpoints:
**Archivos:**
  - `backend/product-service/main.py`  
  - `backend/product-service/models.py`  
  - `backend/product-service/db.py`  
  - `backend/product-service/crud.py`  
  - `backend/product-service/routes.py`  
  - `backend/product-service/dependencies.py`  
  - `backend/product-service/alembic.ini`


### 🟢 PROD — Order Service — cart (Redis), orders, status, history
> Implement the Order Service (FastAPI, SQLAlchemy, Alembic, PostgreSQL, Redis) with endpoints:
**Archivos:**
  - `backend/order-service/main.py`  
  - `backend/order-service/models.py`  
  - `backend/order-service/db.py`  
  - `backend/order-service/crud.py`  
  - `backend/order-service/routes.py`  
  - `backend/order-service/dependencies.py`  
  - `backend/order-service/alembic.ini`


### 🟢 PROD — Frontend — core hooks, API modules, layout, auth
> Implement frontend core:
**Archivos:**
  - `frontend/vite.config.js`  
  - `frontend/index.html`  
  - `frontend/src/main.jsx`  
  - `frontend/src/App.jsx`  
  - `frontend/src/router.jsx`  
  - `frontend/src/components/Layout/Header.jsx`  
  - `frontend/src/components/Layout/Footer.jsx`  
  - `frontend/src/components/Auth/LoginForm.jsx`  
  - `frontend/src/components/Auth/RegisterForm.jsx`  
  - `frontend/src/components/Auth/UserMenu.jsx`  
  - `frontend/src/pages/Login.jsx`  
  - `frontend/src/pages/Register.jsx`


### 🟢 PROD — Frontend — product, cart, checkout, orders, admin pages (1/2)
> Implement all user/admin pages and features:
**Archivos:**
  - `frontend/src/components/Product/ProductList.jsx`  
  - `frontend/src/components/Product/ProductForm.jsx`  
  - `frontend/src/components/Product/ProductDetail.jsx`  
  - `frontend/src/components/Order/OrderList.jsx`  
  - `frontend/src/components/Order/OrderForm.jsx`  
  - `frontend/src/components/Order/OrderDetail.jsx`  
  - `frontend/src/pages/Home.jsx`  
  - `frontend/src/pages/Products.jsx`  
  - `frontend/src/pages/ProductEdit.jsx`  
  - `frontend/src/pages/Orders.jsx`


### 🟢 PROD — Frontend — product, cart, checkout, orders, admin pages (2/2)
> Implement all user/admin pages and features:
**Archivos:**
  - `frontend/src/pages/OrderDetail.jsx`  
  - `frontend/src/pages/AdminDashboard.jsx`


## Wave 3

### 🟢 PROD — Infrastructure & Deployment (REQUIRED — PROJECT MUST RUN)
> Complete Docker orchestration and documentation for zero-manual-steps local setup:
**Archivos:**



---

# §3 Reglas de Infraestructura (obligatorias)

## §3.1 Dockerfiles
- `WORKDIR /app` en todos los Dockerfiles — paths portables, nunca UUIDs ni `/workspace/...`
- El `docker build` debe funcionar en cualquier máquina sin modificaciones

## §3.2 Base de Datos — Auto-Init Obligatorio
Si el proyecto usa base de datos relacional (PostgreSQL, MySQL, SQLite, MariaDB, etc.),
el backend DEBE ejecutar esta secuencia automáticamente al arrancar el contenedor:

1. **Esperar a que la DB esté lista** — retry loop o wait-for-it, nunca asumir que está disponible
2. **Correr migraciones** — `alembic upgrade head` / `prisma migrate deploy` / `knex migrate:latest` / etc.
3. **Seed de datos de ejemplo** — solo si la tabla principal está vacía (idempotente, nunca duplica al reiniciar)
   - Insertar **3–5 registros realistas** por entidad principal
   - El seed usa los mismos modelos/schemas del proyecto — nunca SQL crudo hardcodeado
   - Patrón Python: `if db.query(Model).count() == 0: db.add_all([...]); db.commit()`
   - Patrón Node: `const count = await prisma.model.count(); if (count === 0) { await prisma.model.createMany({...}) }`

Resultado: después de `./run.sh` la app tiene datos de ejemplo listos, sin pasos manuales.

## §3.3 Puertos de Servicio
- Rango obligatorio para **todos** los puertos del host en docker-compose.yml: **21000–65000**.
- Aplica a TODOS los servicios: backends, frontends Y bases de datos / infraestructura.
- El puerto interno del contenedor se mantiene en el default de la tecnología:
  | Tecnología | Puerto interno | Ejemplo host mapping |
  |-----------|---------------|----------------------|
  | PostgreSQL | 5432 | `'25432:5432'` |
  | MySQL      | 3306 | `'23306:3306'` |
  | Redis      | 6379 | `'26379:6379'` |
  | MongoDB    | 27017 | `'37017:27017'` |
  | Backend API | (PORT TABLE §1.1) | `'23001:23001'` |
- NUNCA exponer 3000, 5000, 5432, 6379, 8000, 8080, 8443 en el lado del host.
- El Tech Lead remapeará automáticamente cualquier puerto fuera del rango 21000–65000.

## §3.4 Frontend con Vite / React / Vue
- `index.html` en la RAÍZ del proyecto (mismo nivel que `package.json` y `vite.config.js`)
- NUNCA solo en `public/` — Vite requiere el entry point en la raíz
- Entry point: `<script type='module' src='/src/main.jsx'></script>`

## §3.5 Variables de Entorno
- Vite: `import.meta.env.VITE_NOMBRE` con fallback → `|| 'http://localhost:PUERTO'` (PUERTO del PORT TABLE §1.1)
- Nunca hardcodear URLs, tokens ni secrets en código fuente

## §3.6 Criterios de Finalización
- Todos los archivos listados en §2 deben existir en disco
- Código completo y funcional — sin TODOs ni stubs
- Tests corriendo y pasando antes del commit final
- `git add -A && git commit -m 'feat: implement project'`

## §3.7 Configuración de Test Tooling (requerida por ítems 🔴 TEST del §2)

### jest
- Test files → `{project_root}/tests/*.test.{js,jsx,ts,tsx}` (never `.spec.*` co-located with source)
- `package.json` MUST include in `devDependencies`: `jest`, `@types/jest`
- `package.json` MUST include script: `"test": "jest --coverage"`
- Run: `npx jest --coverage`

### pytest
- Test files → `{service_root}/tests/test_*.py` (never co-located with source)
- `requirements.txt` MUST include: `pytest`, `pytest-cov`, `pytest-asyncio`, `httpx`
- Run: `python -m pytest tests/ --tb=short -q --cov=. --cov-report=term-missing`

### vitest
- Test files → `{frontend_root}/tests/*.test.{js,jsx,ts,tsx}` (never `.spec.*` co-located with source)
- `package.json` MUST include in `devDependencies`: `vitest`, `@vitest/coverage-v8`, `jsdom`
- For React projects also add: `@testing-library/react`, `@testing-library/jest-dom`
- `package.json` MUST include script: `"test": "vitest run --coverage"`
- `vite.config.*` MUST include `test` section:
  ```js
  test: { globals: true, environment: 'jsdom', include: ['tests/**/*.test.{js,jsx,ts,tsx}'] }
  ```
- Create `{frontend_root}/tests/setup.js` with: `import '@testing-library/jest-dom'`
- Run: `npx vitest run --coverage`