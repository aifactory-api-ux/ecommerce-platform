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
  - Vite 5.2.0
  - React Router 6.22.3
  - JavaScript (ES2022)
  - Axios 1.6.7

- **Infrastructure**
  - Docker 26.0.0
  - Docker Compose 2.27.0

---

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
```

#### backend/product-service/models.py

```python
from pydantic import BaseModel
from typing import Literal

class ProductCreateRequest(BaseModel):
    name: str
    description: str
    price: float
    stock: int

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    stock: int

class ProductListResponse(BaseModel):
    products: list[ProductResponse]
```

#### backend/order-service/models.py

```python
from pydantic import BaseModel
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
    items: List[OrderItemResponse]
    total: float
    status: str

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

export interface UserRegisterResponse {
  id: number;
  email: string;
  name: string;
  role: "customer" | "admin";
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface TokenRefreshResponse {
  access_token: string;
  token_type: "bearer";
}

export interface UserProfileResponse {
  id: number;
  email: string;
  name: string;
  role: "customer" | "admin";
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
  items: OrderItemResponse[];
  total: number;
  status: string;
}

export interface OrderListResponse {
  orders: OrderResponse[];
}
```

---

## 3. API ENDPOINTS

### Auth Service

- **POST /auth/register**
  - Request: `UserRegisterRequest`
  - Response: `UserRegisterResponse`

- **POST /auth/login**
  - Request: `UserLoginRequest`
  - Response: `UserLoginResponse`

- **POST /auth/refresh**
  - Request: `TokenRefreshRequest`
  - Response: `TokenRefreshResponse`

- **GET /auth/me**
  - Auth: Bearer token required
  - Response: `UserProfileResponse`

---

### Product Service

- **POST /products**
  - Auth: Bearer token (admin only)
  - Request: `ProductCreateRequest`
  - Response: `ProductResponse`

- **GET /products**
  - Response: `ProductListResponse`

- **GET /products/{id}**
  - Response: `ProductResponse`

- **PUT /products/{id}**
  - Auth: Bearer token (admin only)
  - Request: `ProductCreateRequest`
  - Response: `ProductResponse`

- **DELETE /products/{id}**
  - Auth: Bearer token (admin only)
  - Response: `{ "detail": "Product deleted" }`

---

### Order Service

- **POST /orders**
  - Auth: Bearer token (customer only)
  - Request: `OrderCreateRequest`
  - Response: `OrderResponse`

- **GET /orders**
  - Auth: Bearer token (customer: own orders, admin: all orders)
  - Response: `OrderListResponse`

- **GET /orders/{id}**
  - Auth: Bearer token (customer: own order, admin: any order)
  - Response: `OrderResponse`

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service           | Listening Port | Path                        |
|-------------------|---------------|-----------------------------|
| auth-service      | 23001         | backend/auth-service/       |
| product-service   | 23002         | backend/product-service/    |
| order-service     | 23003         | backend/order-service/      |

### SHARED MODULES

| Shared path         | Imported by services                         |
|---------------------|---------------------------------------------|
| backend/shared/     | auth-service, product-service, order-service |

---

### File Tree

```
.
├── docker-compose.yml                # Multi-service orchestration
├── .env.example                     # Template for environment variables
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── run.sh                           # Root startup script
├── backend/
│   ├── shared/                      # Shared Python modules (schemas, utils)
│   │   ├── models.py                # Shared Pydantic models
│   │   ├── db.py                    # Shared DB connection logic
│   │   └── utils.py                 # Shared utility functions
│   ├── auth-service/
│   │   ├── Dockerfile               # Auth service Docker build
│   │   ├── main.py                  # FastAPI entrypoint
│   │   ├── models.py                # Pydantic models for auth
│   │   ├── db.py                    # SQLAlchemy models and session
│   │   ├── crud.py                  # CRUD logic for users
│   │   ├── routes.py                # FastAPI route definitions
│   │   ├── auth.py                  # JWT and password logic
│   │   ├── dependencies.py          # Dependency injection
│   │   ├── alembic.ini              # Alembic config
│   │   └── migrations/              # Alembic migrations
│   ├── product-service/
│   │   ├── Dockerfile               # Product service Docker build
│   │   ├── main.py                  # FastAPI entrypoint
│   │   ├── models.py                # Pydantic models for products
│   │   ├── db.py                    # SQLAlchemy models and session
│   │   ├── crud.py                  # CRUD logic for products
│   │   ├── routes.py                # FastAPI route definitions
│   │   ├── dependencies.py          # Dependency injection
│   │   ├── alembic.ini              # Alembic config
│   │   └── migrations/              # Alembic migrations
│   ├── order-service/
│   │   ├── Dockerfile               # Order service Docker build
│   │   ├── main.py                  # FastAPI entrypoint
│   │   ├── models.py                # Pydantic models for orders
│   │   ├── db.py                    # SQLAlchemy models and session
│   │   ├── crud.py                  # CRUD logic for orders
│   │   ├── routes.py                # FastAPI route definitions
│   │   ├── dependencies.py          # Dependency injection
│   │   ├── alembic.ini              # Alembic config
│   │   └── migrations/              # Alembic migrations
├── frontend/
│   ├── Dockerfile                   # Frontend Docker build
│   ├── vite.config.js               # Vite configuration
│   ├── index.html                   # HTML entrypoint
│   ├── src/
│   │   ├── main.jsx                 # React entrypoint
│   │   ├── App.jsx                  # Root component
│   │   ├── api/
│   │   │   ├── auth.js              # Auth API calls
│   │   │   ├── product.js           # Product API calls
│   │   │   └── order.js             # Order API calls
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth state hook
│   │   │   ├── useProducts.js       # Product state hook
│   │   │   └── useOrders.js         # Order state hook
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx    # Login form
│   │   │   │   └── RegisterForm.jsx # Registration form
│   │   │   ├── Product/
│   │   │   │   ├── ProductList.jsx  # Product list
│   │   │   │   ├── ProductForm.jsx  # Product create/edit form
│   │   │   │   └── ProductDetail.jsx# Product detail view
│   │   │   ├── Order/
│   │   │   │   ├── OrderList.jsx    # Order list
│   │   │   │   ├── OrderForm.jsx    # Order create form
│   │   │   │   └── OrderDetail.jsx  # Order detail view
│   │   ├── routes/
│   │   │   ├── AuthRoutes.jsx       # Auth-related routes
│   │   │   ├── ProductRoutes.jsx    # Product-related routes
│   │   │   └── OrderRoutes.jsx      # Order-related routes
│   │   ├── types/
│   │   │   ├── auth.ts              # Auth TypeScript interfaces
│   │   │   ├── product.ts           # Product TypeScript interfaces
│   │   │   └── order.ts             # Order TypeScript interfaces
│   │   └── utils/
│   │       └── storage.js           # LocalStorage/session helpers
```

---

## 5. ENVIRONMENT VARIABLES

| Name                        | Type   | Description                                      | Example Value                |
|-----------------------------|--------|--------------------------------------------------|------------------------------|
| POSTGRES_HOST               | str    | PostgreSQL host                                  | postgres                     |
| POSTGRES_PORT               | int    | PostgreSQL port                                  | 5432                         |
| POSTGRES_USER               | str    | PostgreSQL username                              | ecommerce                    |
| POSTGRES_PASSWORD           | str    | PostgreSQL password                              | secretpassword               |
| POSTGRES_DB                 | str    | PostgreSQL database name                         | ecommerce_db                 |
| REDIS_HOST                  | str    | Redis host                                       | redis                        |
| REDIS_PORT                  | int    | Redis port                                       | 6379                         |
| AUTH_JWT_SECRET             | str    | JWT secret for auth-service                      | supersecretjwtkey            |
| AUTH_JWT_EXPIRE_MINUTES     | int    | JWT access token expiry (minutes)                | 60                           |
| AUTH_JWT_REFRESH_EXPIRE_DAYS| int    | JWT refresh token expiry (days)                  | 7                            |
| PRODUCT_SERVICE_HOST        | str    | Product service host (for inter-service calls)   | product-service              |
| PRODUCT_SERVICE_PORT        | int    | Product service port                             | 23002                        |
| ORDER_SERVICE_HOST          | str    | Order service host (for inter-service calls)     | order-service                |
| ORDER_SERVICE_PORT          | int    | Order service port                               | 23003                        |
| FRONTEND_URL                | str    | Public URL for frontend                          | http://localhost:3000        |
| BACKEND_AUTH_URL            | str    | Auth service base URL (frontend)                 | http://localhost:23001       |
| BACKEND_PRODUCT_URL         | str    | Product service base URL (frontend)              | http://localhost:23002       |
| BACKEND_ORDER_URL           | str    | Order service base URL (frontend)                | http://localhost:23003       |

---

## 6. IMPORT CONTRACTS

### backend/shared/models.py

```python
from backend.shared.models import UserRegisterRequest, UserRegisterResponse, UserLoginRequest, UserLoginResponse, TokenRefreshRequest, TokenRefreshResponse, UserProfileResponse, ProductCreateRequest, ProductResponse, ProductListResponse, OrderItemRequest, OrderCreateRequest, OrderItemResponse, OrderResponse, OrderListResponse
```

### backend/shared/db.py

```python
from backend.shared.db import get_db_session, Base
```

### backend/shared/utils.py

```python
from backend.shared.utils import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
```

### backend/auth-service/models.py

```python
from backend.auth-service.models import UserRegisterRequest, UserRegisterResponse, UserLoginRequest, UserLoginResponse, TokenRefreshRequest, TokenRefreshResponse, UserProfileResponse
```

### backend/product-service/models.py

```python
from backend.product-service.models import ProductCreateRequest, ProductResponse, ProductListResponse
```

### backend/order-service/models.py

```python
from backend.order-service.models import OrderItemRequest, OrderCreateRequest, OrderItemResponse, OrderResponse, OrderListResponse
```

### frontend/src/types/auth.ts

```typescript
import { UserRegisterRequest, UserRegisterResponse, UserLoginRequest, UserLoginResponse, TokenRefreshRequest, TokenRefreshResponse, UserProfileResponse } from '../types/auth';
```

### frontend/src/types/product.ts

```typescript
import { ProductCreateRequest, ProductResponse, ProductListResponse } from '../types/product';
```

### frontend/src/types/order.ts

```typescript
import { OrderItemRequest, OrderCreateRequest, OrderItemResponse, OrderResponse, OrderListResponse } from '../types/order';
```

### frontend/src/hooks/useAuth.js

```javascript
import useAuth from '../hooks/useAuth';
```

### frontend/src/hooks/useProducts.js

```javascript
import useProducts from '../hooks/useProducts';
```

### frontend/src/hooks/useOrders.js

```javascript
import useOrders from '../hooks/useOrders';
```

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives

```
useAuth() → {
  user: UserProfileResponse | null,
  loading: boolean,
  error: string | null,
  login: (data: UserLoginRequest) => Promise<void>,
  register: (data: UserRegisterRequest) => Promise<void>,
  logout: () => void,
  refresh: () => Promise<void>
}

useProducts() → {
  products: ProductResponse[],
  loading: boolean,
  error: string | null,
  fetchProducts: () => Promise<void>,
  createProduct: (data: ProductCreateRequest) => Promise<void>,
  updateProduct: (id: number, data: ProductCreateRequest) => Promise<void>,
  deleteProduct: (id: number) => Promise<void>
}

useOrders() → {
  orders: OrderResponse[],
  loading: boolean,
  error: string | null,
  fetchOrders: () => Promise<void>,
  createOrder: (data: OrderCreateRequest) => Promise<void>
}
```

### Reusable Component Props/Inputs

```
LoginForm props: { onSubmit: (data: UserLoginRequest) => void, loading: boolean, error: string | null }
RegisterForm props: { onSubmit: (data: UserRegisterRequest) => void, loading: boolean, error: string | null }
ProductList props: { products: ProductResponse[], onEdit: (id: number) => void, onDelete: (id: number) => void, loading: boolean }
ProductForm props: { onSubmit: (data: ProductCreateRequest) => void, loading: boolean, initialData?: ProductCreateRequest }
ProductDetail props: { product: ProductResponse, onAddToCart: (id: number) => void }
OrderList props: { orders: OrderResponse[], loading: boolean }
OrderForm props: { onSubmit: (data: OrderCreateRequest) => void, loading: boolean }
OrderDetail props: { order: OrderResponse }
```

---

## 8. FILE EXTENSION CONVENTION

- All frontend files use `.jsx` for React components and hooks.
- The project is JavaScript (not TypeScript) for implementation, but all types/interfaces are defined in `.ts` files under `src/types/` for type-checking and documentation.
- Entry point: `/src/main.jsx` (as referenced in `index.html` via `<script type="module" src="/src/main.jsx"></script>`)

## §1.2 Contrato API (OpenAPI 3.1)
> Ref obligatoria para tests de endpoints: usa los paths, schemas y status codes exactos de aquí.

```yaml
# API_CONTRACT.md

## Auth Service

| Method | Path            | Auth Required | Request Body Schema         | Response Schema            | Status Codes |
|--------|-----------------|--------------|----------------------------|----------------------------|--------------|
| POST   | /auth/register  | No           | UserRegisterRequest        | UserRegisterResponse       | 200          |
| POST   | /auth/login     | No           | UserLoginRequest           | UserLoginResponse          | 200          |
| POST   | /auth/refresh   | No           | TokenRefreshRequest        | TokenRefreshResponse       | 200          |
| GET    | /auth/me        | Yes (Bearer) | N/A                        | UserProfileResponse        | 200          |

### Schemas

#### UserRegisterRequest

| Field    | Type   | Required |
|----------|--------|----------|
| email    | string | Yes      |
| password | string | Yes      |
| name     | string | Yes      |

#### UserRegisterResponse

| Field | Type   |
|-------|--------|
| id    | int    |
| email | string |
| name  | string |
| role  | "customer" \| "admin" |

#### UserLoginRequest

| Field    | Type   | Required |
|----------|--------|----------|
| email    | string | Yes      |
| password | string | Yes      |

#### UserLoginResponse

| Field         | Type   |
|---------------|--------|
| access_token  | string |
| refresh_token | string |
| token_type    | "bearer" |

#### TokenRefreshRequest

| Field         | Type   | Required |
|---------------|--------|----------|
| refresh_token | string | Yes      |

#### TokenRefreshResponse

| Field        | Type      |
|--------------|-----------|
| access_token | string    |
| token_type   | "bearer"  |

#### UserProfileResponse

| Field | Type   |
|-------|--------|
| id    | int    |
| email | string |
| name  | string |
| role  | "customer" \| "admin" |

---

## Product Service

| Method | Path              | Auth Required         | Request Body Schema      | Response Schema         | Status Codes |
|--------|-------------------|----------------------|-------------------------|------------------------|--------------|
| POST   | /products         | Yes (Bearer, admin)  | ProductCreateRequest    | ProductResponse        | 200          |
| GET    | /products         | No                   | N/A                    | ProductListResponse    | 200          |
| GET    | /products/{id}    | No                   | N/A                    | ProductResponse        | 200          |
| PUT    | /products/{id}    | Yes (Bearer, admin)  | ProductCreateRequest    | ProductResponse        | 200          |
| DELETE | /products/{id}    | Yes (Bearer, admin)  | N/A                    | { "detail": "Product deleted" } | 200 |

### Schemas

#### ProductCreateRequest

| Field       | Type    | Required |
|-------------|---------|----------|
| name        | string  | Yes      |
| description | string  | Yes      |
| price       | float   | Yes      |
| stock       | int     | Yes      |

#### ProductResponse

| Field       | Type    |
|-------------|---------|
| id          | int     |
| name        | string  |
| description | string  |
| price       | float   |
| stock       | int     |

#### ProductListResponse

| Field    | Type                |
|----------|---------------------|
| products | ProductResponse[]   |

---

## Order Service

| Method | Path           | Auth Required                     | Request Body Schema    | Response Schema      | Status Codes |
|--------|----------------|-----------------------------------|-----------------------|---------------------|--------------|
| POST   | /orders        | Yes (Bearer, customer only)       | OrderCreateRequest    | OrderResponse       | 200          |
| GET    | /orders        | Yes (Bearer, customer/admin)      | N/A                   | OrderListResponse   | 200          |
| GET    | /orders/{id}   | Yes (Bearer, customer/admin)      | N/A                   | OrderResponse       | 200          |

### Schemas

#### OrderItemRequest

| Field      | Type | Required |
|------------|------|----------|
| product_id | int  | Yes      |
| quantity   | int  | Yes      |

#### OrderCreateRequest

| Field | Type                 | Required |
|-------|----------------------|----------|
| items | OrderItemRequest[]   | Yes      |

#### OrderItemResponse

| Field      | Type    |
|------------|---------|
| product_id | int     |
| name       | string  |
| price      | float   |
| quantity   | int     |

#### OrderResponse

| Field   | Type                 |
|---------|----------------------|
| id      | int                  |
| user_id | int                  |
| items   | OrderItemResponse[]  |
| total   | float                |
| status  | string               |

#### OrderListResponse

| Field  | Type             |
|--------|------------------|
| orders | OrderResponse[]  |
```

## §1.3 Archivos de Test y Scripts a Crear (TDD — complemento de la estructura §1.1)
> La FILE STRUCTURE de §1.1 fue generada antes de los specs TDD — no incluye `tests/` ni `run_tests.sh`.
> Los siguientes archivos son OBLIGATORIOS. Créalos en los paths exactos indicados.
> ⚠️  NUNCA usar archivos `.spec.*` co-ubicados con el source.

**Scripts de ejecución (crear y hacer chmod +x):**
- `backend/run_tests.sh`
- `frontend/run_tests.sh`

**Archivos de test (crear en los paths exactos):**
- `backend/order-service/tests/test_crud.py`
- `backend/order-service/tests/test_db.py`
- `backend/order-service/tests/test_dependencies.py`
- `backend/order-service/tests/test_main.py`
- `backend/order-service/tests/test_models.py`
- `backend/order-service/tests/test_routes.py`
- `backend/tests/test_architecture_md.py`
- `backend/tests/test_auth.py`
- `backend/tests/test_crud.py`
- `backend/tests/test_db.py`
- `backend/tests/test_dependencies.py`
- `backend/tests/test_docker_compose.py`
- `backend/tests/test_main.py`
- `backend/tests/test_models.py`
- `backend/tests/test_readme_md.py`
- `backend/tests/test_routes.py`
- `backend/tests/test_run_sh.py`
- `backend/tests/test_utils.py`
- `frontend/tests/App.test.jsx`
- `frontend/tests/api/auth.test.jsx`
- `frontend/tests/api/order.test.jsx`
- `frontend/tests/api/product.test.jsx`
- `frontend/tests/components/Auth/LoginForm.test.jsx`
- `frontend/tests/components/Auth/RegisterForm.test.jsx`
- `frontend/tests/components/Order/OrderDetail.test.jsx`
- `frontend/tests/components/Order/OrderForm.test.jsx`
- `frontend/tests/components/Order/OrderList.test.jsx`
- `frontend/tests/components/Product/ProductDetail.test.jsx`
- `frontend/tests/components/Product/ProductForm.test.jsx`
- `frontend/tests/components/Product/ProductList.test.jsx`
- `frontend/tests/hooks/useAuth.test.jsx`
- `frontend/tests/hooks/useOrders.test.jsx`
- `frontend/tests/hooks/useProducts.test.jsx`
- `frontend/tests/index.test.jsx`
- `frontend/tests/main.test.jsx`
- `frontend/tests/routes/AuthRoutes.test.jsx`
- `frontend/tests/routes/OrderRoutes.test.jsx`
- `frontend/tests/routes/ProductRoutes.test.jsx`
- `frontend/tests/types/auth.test.tsx`
- `frontend/tests/types/order.test.tsx`
- `frontend/tests/types/product.test.tsx`
- `frontend/tests/utils/storage.test.jsx`
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
- `test_product_create_request_valid`: ProductCreateRequest accepts valid data and produces correct fields.
  - Input: `{'name': 'Test Product', 'description': 'A product', 'price': 19.99, 'stock': 10}`
  - Expected: `{'fields': ['name', 'description', 'price', 'stock']}`
- `test_product_create_request_missing_field_raises_validation_error`: ProductCreateRequest missing required field 'name' raises validation error.
  - Input: `{'description': 'A product', 'price': 19.99, 'stock': 10}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_product_create_request_negative_stock_accepted`: ProductCreateRequest with negative stock is accepted (edge case, no validation).
  - Input: `{'name': 'Test Product', 'description': 'A product', 'price': 19.99, 'stock': -5}`
  - Expected: `{'fields': ['name', 'description', 'price', 'stock']}`

### 🔴 TEST — Tests: backend/shared/db.py
> Ref: §1.1 (modelos de `backend/product-service/db.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_db.py`

**Casos de prueba (implementar todos):**
- `test_category_model_persistence`: Category SQLAlchemy model can be created and persisted to the database.
  - Input: `{'name': 'Electronics'}`
  - Expected: `{'fields': ['id', 'name']}`
- `test_product_model_foreign_key_category`: Product model with valid category_id is persisted and linked to Category.
  - Input: `{'category': {'name': 'Books'}, 'product': {'name': 'Book 1', 'description': 'A book', 'price': 10.0, 'stock': 5}}`
  - Expected: `{'fields': ['id', 'name', 'category_id']}`
- `test_review_model_invalid_product_id_raises`: Review model creation with non-existent product_id raises IntegrityError.
  - Input: `{'review': {'product_id': 999, 'user_id': 1, 'rating': 5, 'comment': 'Great!'}}`
  - Expected: `{'raises': 'IntegrityError'}`

### 🔴 TEST — Tests: backend/shared/utils.py
> Ref: §1.1 (modelos de `backend/shared/utils.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_utils.py`

**Casos de prueba (implementar todos):**
- `test_password_hash_and_verify_success`: Password hashing and verification utility returns True for correct password.
  - Input: `{'password': 'MySecret123!'}`
  - Expected: `{'verify_result': True}`
- `test_password_verify_failure`: Password verification utility returns False for incorrect password.
  - Input: `{'password': 'MySecret123!', 'wrong_password': 'WrongPass!'}`
  - Expected: `{'verify_result': False}`
- `test_jwt_encode_and_decode_valid`: JWT encode and decode utilities correctly encode and decode payload.
  - Input: `{'payload': {'user_id': 1, 'role': 'admin'}, 'secret': 'testsecret'}`
  - Expected: `{'decoded_payload': {'user_id': 1, 'role': 'admin'}}`
- `test_jwt_decode_invalid_token_raises_error`: JWT decode utility raises error for invalid token.
  - Input: `{'token': 'invalid.token.value', 'secret': 'testsecret'}`
  - Expected: `{'raises': 'JWTError'}`
- `test_pagination_helper_returns_correct_slice`: Pagination helper returns correct slice of items for given page and size.
  - Input: `{'items': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'page': 2, 'size': 3}`
  - Expected: `{'result': [4, 5, 6]}`

### 🔴 TEST — Tests: frontend/src/types/auth.ts
> Ref: §1.1 (modelos de `frontend/src/types/auth.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/types/auth.test.tsx`

**Casos de prueba (implementar todos):**
- `test_UserRegisterRequest_interface_accepts_valid_fields`: UserRegisterRequest interface accepts valid email, password, and name fields.
  - Input: `{'email': 'user@example.com', 'password': 'StrongPass123!', 'name': 'Alice'}`
  - Expected: `{'type_check': True}`
- `test_UserRegisterRequest_missing_field_type_error`: UserRegisterRequest interface raises type error if required field is missing.
  - Input: `{'email': 'user@example.com', 'password': 'StrongPass123!'}`
  - Expected: `{'type_check': False, 'error_field': 'name'}`
- `test_UserLoginResponse_token_type_literal`: UserLoginResponse interface enforces token_type to be 'bearer' only.
  - Input: `{'access_token': 'abc', 'refresh_token': 'def', 'token_type': 'bearer'}`
  - Expected: `{'type_check': True}`
- `test_UserLoginResponse_token_type_invalid_literal`: UserLoginResponse interface raises type error for invalid token_type value.
  - Input: `{'access_token': 'abc', 'refresh_token': 'def', 'token_type': 'invalid'}`
  - Expected: `{'type_check': False, 'error_field': 'token_type'}`

### 🔴 TEST — Tests: frontend/src/types/product.ts
> Ref: §1.1 (modelos de `frontend/src/types/product.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/types/product.test.tsx`

**Casos de prueba (implementar todos):**
- `test_ProductCreateRequest_interface_accepts_valid_fields`: ProductCreateRequest interface accepts valid name, description, price, and stock fields.
  - Input: `{'name': 'Widget', 'description': 'A useful widget', 'price': 19.99, 'stock': 100}`
  - Expected: `{'type_check': True}`
- `test_ProductCreateRequest_missing_field_type_error`: ProductCreateRequest interface raises type error if required field is missing.
  - Input: `{'name': 'Widget', 'description': 'A useful widget', 'price': 19.99}`
  - Expected: `{'type_check': False, 'error_field': 'stock'}`
- `test_ProductResponse_interface_enforces_types`: ProductResponse interface enforces id as number, price as number, stock as number.
  - Input: `{'id': 'not-a-number', 'name': 'Widget', 'description': 'A useful widget', 'price': 'not-a-number', 'stock': 'not-a-number'}`
  - Expected: `{'type_check': False, 'error_fields': ['id', 'price', 'stock']}`

### 🔴 TEST — Tests: frontend/src/types/order.ts
> Ref: §1.1 (modelos de `frontend/src/types/order.ts`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/types/order.test.tsx`

**Casos de prueba (implementar todos):**
- `test_OrderCreateRequest_interface_accepts_valid_items`: OrderCreateRequest interface accepts items array with valid product_id and quantity.
  - Input: `{'items': [{'product_id': 1, 'quantity': 2}, {'product_id': 2, 'quantity': 1}]}`
  - Expected: `{'type_check': True}`
- `test_OrderCreateRequest_items_missing_field_type_error`: OrderCreateRequest interface raises type error if an item is missing required field.
  - Input: `{'items': [{'product_id': 1}]}`
  - Expected: `{'type_check': False, 'error_field': 'quantity'}`
- `test_OrderItemResponse_interface_enforces_types`: OrderItemResponse interface enforces product_id as number, name as string, price as number.
  - Input: `{'product_id': 'not-a-number', 'name': 123, 'price': 'not-a-number'}`
  - Expected: `{'type_check': False, 'error_fields': ['product_id', 'name', 'price']}`

### 🔴 TEST — Tests: backend/infrastructure/docker_compose.py
> Ref: §1.1 (modelos de `backend/infrastructure/docker_compose.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_docker_compose.py`

**Casos de prueba (implementar todos):**
- `test_docker_compose_services_and_ports_defined`: docker-compose.yml must define all required services (auth-service, product-service, order-service, frontend, postgres for each service, redis) with correct ports exposed.
  - Expected: `{'services': ['auth-service', 'product-service', 'order-service', 'frontend', 'auth-postgres', 'product-postgres', 'order-postgres', 'redis'], 'ports': {'auth-service': 8001, 'product-service': 8002, 'order-service': 8003, 'frontend': 5173}}`
- `test_docker_compose_healthchecks_and_depends_on`: docker-compose.yml must include healthchecks for all services and use depends_on with condition: service_healthy.
  - Expected: `{'healthchecks_present': ['auth-service', 'product-service', 'order-service', 'frontend', 'auth-postgres', 'product-postgres', 'order-postgres', 'redis'], 'depends_on_service_healthy': ['auth-service', 'product-service', 'order-service', 'frontend']}`
- `test_docker_compose_env_vars_and_build_contexts`: docker-compose.yml must set environment variables for each service and specify correct build contexts.
  - Expected: `{'env_files': ['auth-service', 'product-service', 'order-service', 'frontend'], 'build_contexts': ['auth-service', 'product-service', 'order-service', 'frontend']}`
- `test_docker_compose_missing_service_returns_error`: docker-compose.yml missing a required service (e.g., redis) must raise a validation error.
  - Input: `{'missing_service': 'redis'}`
  - Expected: `{'error': 'Missing required service: redis'}`
- `test_docker_compose_invalid_port_type_returns_error`: docker-compose.yml with a non-integer port mapping must raise a validation error.
  - Input: `{'service': 'auth-service', 'port': 'not-a-number'}`
  - Expected: `{'error': 'Invalid port mapping for service: auth-service'}`

### 🔴 TEST — Tests: backend/infrastructure/run_sh.py
> Ref: §1.1 (modelos de `backend/infrastructure/run_sh.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_run_sh.py`

**Casos de prueba (implementar todos):**
- `test_run_sh_validates_docker_and_builds_images`: run.sh must check for Docker and Docker Compose installation, then build all images without error.
  - Expected: `{'docker_checked': True, 'docker_compose_checked': True, 'images_built': ['auth-service', 'product-service', 'order-service', 'frontend']}`
- `test_run_sh_waits_for_services_healthy_and_prints_urls`: run.sh must wait for all services to be healthy and print access URLs for frontend and APIs.
  - Expected: `{'services_healthy': ['auth-service', 'product-service', 'order-service', 'frontend'], 'urls_printed': ['http://localhost:8001', 'http://localhost:8002', 'http://localhost:8003', 'http://localhost:5173']}`
- `test_run_sh_missing_docker_returns_error`: run.sh must exit with an error if Docker is not installed.
  - Input: `{'docker_installed': False}`
  - Expected: `{'error': 'Docker is not installed'}`
- `test_run_sh_service_unhealthy_times_out`: run.sh must exit with an error if a service does not become healthy within the timeout.
  - Input: `{'service_unhealthy': 'product-service'}`
  - Expected: `{'error': 'Timeout waiting for product-service to become healthy'}`

### 🔴 TEST — Tests: backend/infrastructure/readme_md.py
> Ref: §1.1 (modelos de `backend/infrastructure/readme_md.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_readme_md.py`

**Casos de prueba (implementar todos):**
- `test_readme_md_includes_prerequisites_and_setup`: README.md must include sections for prerequisites, clone instructions, and setup steps.
  - Expected: `{'sections_present': ['Prerequisites', 'Clone', 'Setup']}`
- `test_readme_md_lists_all_api_endpoints`: README.md must list all API endpoints for auth, product, and order services as per API contract.
  - Expected: `{'endpoints_listed': ['/auth/register', '/auth/login', '/auth/refresh', '/auth/me', '/products', '/products/{id}', '/orders', '/orders/{id}']}`
- `test_readme_md_includes_troubleshooting_section`: README.md must include a troubleshooting section with common errors and solutions.
  - Expected: `{'section_present': 'Troubleshooting'}`
- `test_readme_md_missing_required_section_returns_error`: README.md missing a required section (e.g., Setup) must raise a validation error.
  - Input: `{'missing_section': 'Setup'}`
  - Expected: `{'error': 'README.md missing required section: Setup'}`

### 🔴 TEST — Tests: backend/infrastructure/architecture_md.py
> Ref: §1.1 (modelos de `backend/infrastructure/architecture_md.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_architecture_md.py`

**Casos de prueba (implementar todos):**
- `test_architecture_md_includes_system_diagram`: docs/architecture.md must include a system diagram illustrating all services and their interactions.
  - Expected: `{'diagram_present': True, 'services_in_diagram': ['auth-service', 'product-service', 'order-service', 'frontend', 'postgres', 'redis']}`
- `test_architecture_md_describes_each_component`: docs/architecture.md must provide a description for each system component.
  - Expected: `{'components_described': ['auth-service', 'product-service', 'order-service', 'frontend', 'postgres', 'redis']}`
- `test_architecture_md_missing_diagram_returns_error`: docs/architecture.md missing a system diagram must raise a validation error.
  - Input: `{'diagram_present': False}`
  - Expected: `{'error': 'System diagram missing in architecture.md'}`

### 🟢 PROD — Foundation — shared types, interfaces, DB schemas, config
> Create all shared code and models for cross-service use. This includes all Pydantic and SQLAlchemy models (User, Category, Product, Review, Order, OrderItem, enums), shared DB connection logic, and shared utility functions. Also includes all frontend TypeScript interfaces for API contracts.
**Archivos:**
  - `backend/shared/models.py`  
  - `backend/shared/db.py`  
  - `backend/shared/utils.py`  
  - `frontend/src/types/auth.ts`  
  - `frontend/src/types/product.ts`  
  - `frontend/src/types/order.ts`


## Wave 2

### 🔴 TEST — Tests: backend/auth-service/routes.py
> Ref: §1.1 (modelos de `backend/product-service/routes.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_routes.py`

**Casos de prueba (implementar todos):**
- `test_post_products_admin_success`: POST /products as admin with valid ProductCreateRequest returns 200 and ProductResponse.
  - Input: `{'auth_role': 'admin', 'body': {'name': 'Product X', 'description': 'Desc', 'price': 99.99, 'stock': 10}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock']}`
- `test_post_products_non_admin_forbidden`: POST /products as non-admin returns 403 Forbidden.
  - Input: `{'auth_role': 'customer', 'body': {'name': 'Product X', 'description': 'Desc', 'price': 99.99, 'stock': 10}}`
  - Expected: `{'status_code': 403}`
- `test_post_products_missing_field_returns_422`: POST /products missing required field returns 422 Unprocessable Entity.
  - Input: `{'auth_role': 'admin', 'body': {'description': 'Desc', 'price': 99.99, 'stock': 10}}`
  - Expected: `{'status_code': 422}`
- `test_get_products_returns_paginated_list`: GET /products returns 200 and ProductListResponse with products array.
  - Expected: `{'status_code': 200, 'fields': ['products']}`
- `test_get_product_by_id_success`: GET /products/{id} with valid id returns 200 and ProductResponse.
  - Input: `{'product_id': 1}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock']}`
- `test_get_product_by_id_not_found`: GET /products/{id} with non-existent id returns 404.
  - Input: `{'product_id': 9999}`
  - Expected: `{'status_code': 404}`
- `test_put_products_id_admin_success`: PUT /products/{id} as admin with valid data updates and returns ProductResponse.
  - Input: `{'auth_role': 'admin', 'product_id': 1, 'body': {'name': 'Updated Product', 'description': 'Updated Desc', 'price': 55.0, 'stock': 20}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock']}`
- `test_put_products_id_non_admin_forbidden`: PUT /products/{id} as non-admin returns 403 Forbidden.
  - Input: `{'auth_role': 'customer', 'product_id': 1, 'body': {'name': 'Updated Product', 'description': 'Updated Desc', 'price': 55.0, 'stock': 20}}`
  - Expected: `{'status_code': 403}`
- `test_delete_products_id_admin_success`: DELETE /products/{id} as admin returns 200 and marks product as deleted.
  - Input: `{'auth_role': 'admin', 'product_id': 1}`
  - Expected: `{'status_code': 200, 'body': {'detail': 'Product deleted'}}`
- `test_delete_products_id_non_admin_forbidden`: DELETE /products/{id} as non-admin returns 403 Forbidden.
  - Input: `{'auth_role': 'customer', 'product_id': 1}`
  - Expected: `{'status_code': 403}`

### 🔴 TEST — Tests: backend/auth-service/crud.py
> Ref: §1.1 (modelos de `backend/product-service/crud.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_crud.py`

**Casos de prueba (implementar todos):**
- `test_create_product_success`: create_product creates and returns a Product when given valid data.
  - Input: `{'product_data': {'name': 'New Product', 'description': 'Desc', 'price': 12.5, 'stock': 7}}`
  - Expected: `{'fields': ['id', 'name', 'description', 'price', 'stock']}`
- `test_create_product_missing_name_raises`: create_product with missing 'name' raises ValidationError.
  - Input: `{'product_data': {'description': 'Desc', 'price': 12.5, 'stock': 7}}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_soft_delete_product_sets_deleted_flag`: soft_delete_product marks product as deleted but does not remove from DB.
  - Input: `{'product_id': 1}`
  - Expected: `{'fields': ['id', 'deleted'], 'deleted': True}`

### 🔴 TEST — Tests: backend/auth-service/auth.py
> Ref: §1.1 (modelos de `backend/auth-service/auth.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_auth.py`

**Casos de prueba (implementar todos):**
- `test_hash_password_and_verify_password_success`: hash_password hashes the password and verify_password returns True for correct password
  - Input: `{'password': 'MySecret123!'}`
  - Expected: `{'verify_result': True}`
- `test_verify_password_wrong_password_returns_false`: verify_password returns False for incorrect password
  - Input: `{'password': 'MySecret123!', 'wrong_password': 'WrongSecret'}`
  - Expected: `{'verify_result': False}`
- `test_jwt_encode_and_decode_returns_original_payload`: encode_jwt and decode_jwt round-trip returns original payload
  - Input: `{'payload': {'sub': 'user_id', 'role': 'customer'}}`
  - Expected: `{'decoded_payload': {'sub': 'user_id', 'role': 'customer'}}`
- `test_decode_jwt_with_invalid_token_raises_exception`: decode_jwt with invalid token raises JWTError
  - Input: `{'token': 'invalid.jwt.token'}`
  - Expected: `{'raises': 'JWTError'}`
- `test_rbac_dependency_allows_authorized_role`: RBAC dependency allows access when user role matches required role
  - Input: `{'user_role': 'admin', 'required_role': 'admin'}`
  - Expected: `{'access_granted': True}`
- `test_rbac_dependency_denies_unauthorized_role`: RBAC dependency denies access when user role does not match required role
  - Input: `{'user_role': 'customer', 'required_role': 'admin'}`
  - Expected: `{'raises': 'HTTPException', 'status_code': 403}`

### 🔴 TEST — Tests: backend/auth-service/models.py
> Ref: §1.1 (modelos de `backend/product-service/models.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_models.py`

**Casos de prueba (implementar todos):**
- `test_product_create_request_valid`: ProductCreateRequest accepts valid data and produces correct fields.
  - Input: `{'name': 'Test Product', 'description': 'A product', 'price': 19.99, 'stock': 10}`
  - Expected: `{'fields': ['name', 'description', 'price', 'stock']}`
- `test_product_create_request_missing_field_raises_validation_error`: ProductCreateRequest missing required field 'name' raises validation error.
  - Input: `{'description': 'A product', 'price': 19.99, 'stock': 10}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_product_create_request_negative_stock_accepted`: ProductCreateRequest with negative stock is accepted (edge case, no validation).
  - Input: `{'name': 'Test Product', 'description': 'A product', 'price': 19.99, 'stock': -5}`
  - Expected: `{'fields': ['name', 'description', 'price', 'stock']}`

### 🔴 TEST — Tests: backend/auth-service/db.py
> Ref: §1.1 (modelos de `backend/product-service/db.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_db.py`

**Casos de prueba (implementar todos):**
- `test_category_model_persistence`: Category SQLAlchemy model can be created and persisted to the database.
  - Input: `{'name': 'Electronics'}`
  - Expected: `{'fields': ['id', 'name']}`
- `test_product_model_foreign_key_category`: Product model with valid category_id is persisted and linked to Category.
  - Input: `{'category': {'name': 'Books'}, 'product': {'name': 'Book 1', 'description': 'A book', 'price': 10.0, 'stock': 5}}`
  - Expected: `{'fields': ['id', 'name', 'category_id']}`
- `test_review_model_invalid_product_id_raises`: Review model creation with non-existent product_id raises IntegrityError.
  - Input: `{'review': {'product_id': 999, 'user_id': 1, 'rating': 5, 'comment': 'Great!'}}`
  - Expected: `{'raises': 'IntegrityError'}`

### 🔴 TEST — Tests: backend/auth-service/main.py
> Ref: §1.1 (modelos de `backend/product-service/main.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_main.py`

**Casos de prueba (implementar todos):**
- `test_healthcheck_returns_200`: GET /healthcheck returns 200 and expected response body.
  - Expected: `{'status_code': 200, 'body': {'status': 'ok'}}`
- `test_cors_headers_present_on_options`: OPTIONS request to /products returns CORS headers.
  - Input: `{'method': 'OPTIONS', 'path': '/products'}`
  - Expected: `{'status_code': 200, 'headers': ['access-control-allow-origin', 'access-control-allow-methods']}`
- `test_db_seed_data_on_startup`: On startup, database is seeded with 3 categories and 8 products.
  - Expected: `{'categories_count': 3, 'products_count': 8}`

### 🔴 TEST — Tests: backend/product-service/main.py
> Ref: §1.1 (modelos de `backend/product-service/main.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_main.py`

**Casos de prueba (implementar todos):**
- `test_healthcheck_returns_200`: GET /healthcheck returns 200 and expected response body.
  - Expected: `{'status_code': 200, 'body': {'status': 'ok'}}`
- `test_cors_headers_present_on_options`: OPTIONS request to /products returns CORS headers.
  - Input: `{'method': 'OPTIONS', 'path': '/products'}`
  - Expected: `{'status_code': 200, 'headers': ['access-control-allow-origin', 'access-control-allow-methods']}`
- `test_db_seed_data_on_startup`: On startup, database is seeded with 3 categories and 8 products.
  - Expected: `{'categories_count': 3, 'products_count': 8}`

### 🔴 TEST — Tests: backend/product-service/models.py
> Ref: §1.1 (modelos de `backend/product-service/models.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_models.py`

**Casos de prueba (implementar todos):**
- `test_product_create_request_valid`: ProductCreateRequest accepts valid data and produces correct fields.
  - Input: `{'name': 'Test Product', 'description': 'A product', 'price': 19.99, 'stock': 10}`
  - Expected: `{'fields': ['name', 'description', 'price', 'stock']}`
- `test_product_create_request_missing_field_raises_validation_error`: ProductCreateRequest missing required field 'name' raises validation error.
  - Input: `{'description': 'A product', 'price': 19.99, 'stock': 10}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_product_create_request_negative_stock_accepted`: ProductCreateRequest with negative stock is accepted (edge case, no validation).
  - Input: `{'name': 'Test Product', 'description': 'A product', 'price': 19.99, 'stock': -5}`
  - Expected: `{'fields': ['name', 'description', 'price', 'stock']}`

### 🔴 TEST — Tests: backend/product-service/db.py
> Ref: §1.1 (modelos de `backend/product-service/db.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_db.py`

**Casos de prueba (implementar todos):**
- `test_category_model_persistence`: Category SQLAlchemy model can be created and persisted to the database.
  - Input: `{'name': 'Electronics'}`
  - Expected: `{'fields': ['id', 'name']}`
- `test_product_model_foreign_key_category`: Product model with valid category_id is persisted and linked to Category.
  - Input: `{'category': {'name': 'Books'}, 'product': {'name': 'Book 1', 'description': 'A book', 'price': 10.0, 'stock': 5}}`
  - Expected: `{'fields': ['id', 'name', 'category_id']}`
- `test_review_model_invalid_product_id_raises`: Review model creation with non-existent product_id raises IntegrityError.
  - Input: `{'review': {'product_id': 999, 'user_id': 1, 'rating': 5, 'comment': 'Great!'}}`
  - Expected: `{'raises': 'IntegrityError'}`

### 🔴 TEST — Tests: backend/product-service/crud.py
> Ref: §1.1 (modelos de `backend/product-service/crud.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_crud.py`

**Casos de prueba (implementar todos):**
- `test_create_product_success`: create_product creates and returns a Product when given valid data.
  - Input: `{'product_data': {'name': 'New Product', 'description': 'Desc', 'price': 12.5, 'stock': 7}}`
  - Expected: `{'fields': ['id', 'name', 'description', 'price', 'stock']}`
- `test_create_product_missing_name_raises`: create_product with missing 'name' raises ValidationError.
  - Input: `{'product_data': {'description': 'Desc', 'price': 12.5, 'stock': 7}}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_soft_delete_product_sets_deleted_flag`: soft_delete_product marks product as deleted but does not remove from DB.
  - Input: `{'product_id': 1}`
  - Expected: `{'fields': ['id', 'deleted'], 'deleted': True}`

### 🔴 TEST — Tests: backend/product-service/routes.py
> Ref: §1.1 (modelos de `backend/product-service/routes.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_routes.py`

**Casos de prueba (implementar todos):**
- `test_post_products_admin_success`: POST /products as admin with valid ProductCreateRequest returns 200 and ProductResponse.
  - Input: `{'auth_role': 'admin', 'body': {'name': 'Product X', 'description': 'Desc', 'price': 99.99, 'stock': 10}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock']}`
- `test_post_products_non_admin_forbidden`: POST /products as non-admin returns 403 Forbidden.
  - Input: `{'auth_role': 'customer', 'body': {'name': 'Product X', 'description': 'Desc', 'price': 99.99, 'stock': 10}}`
  - Expected: `{'status_code': 403}`
- `test_post_products_missing_field_returns_422`: POST /products missing required field returns 422 Unprocessable Entity.
  - Input: `{'auth_role': 'admin', 'body': {'description': 'Desc', 'price': 99.99, 'stock': 10}}`
  - Expected: `{'status_code': 422}`
- `test_get_products_returns_paginated_list`: GET /products returns 200 and ProductListResponse with products array.
  - Expected: `{'status_code': 200, 'fields': ['products']}`
- `test_get_product_by_id_success`: GET /products/{id} with valid id returns 200 and ProductResponse.
  - Input: `{'product_id': 1}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock']}`
- `test_get_product_by_id_not_found`: GET /products/{id} with non-existent id returns 404.
  - Input: `{'product_id': 9999}`
  - Expected: `{'status_code': 404}`
- `test_put_products_id_admin_success`: PUT /products/{id} as admin with valid data updates and returns ProductResponse.
  - Input: `{'auth_role': 'admin', 'product_id': 1, 'body': {'name': 'Updated Product', 'description': 'Updated Desc', 'price': 55.0, 'stock': 20}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock']}`
- `test_put_products_id_non_admin_forbidden`: PUT /products/{id} as non-admin returns 403 Forbidden.
  - Input: `{'auth_role': 'customer', 'product_id': 1, 'body': {'name': 'Updated Product', 'description': 'Updated Desc', 'price': 55.0, 'stock': 20}}`
  - Expected: `{'status_code': 403}`
- `test_delete_products_id_admin_success`: DELETE /products/{id} as admin returns 200 and marks product as deleted.
  - Input: `{'auth_role': 'admin', 'product_id': 1}`
  - Expected: `{'status_code': 200, 'body': {'detail': 'Product deleted'}}`
- `test_delete_products_id_non_admin_forbidden`: DELETE /products/{id} as non-admin returns 403 Forbidden.
  - Input: `{'auth_role': 'customer', 'product_id': 1}`
  - Expected: `{'status_code': 403}`

### 🔴 TEST — Tests: backend/product-service/dependencies.py
> Ref: §1.1 (modelos de `backend/product-service/dependencies.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/tests/test_dependencies.py`

**Casos de prueba (implementar todos):**
- `test_get_db_dependency_yields_session`: get_db dependency yields a valid SQLAlchemy session.
  - Expected: `{'type': 'AsyncSession'}`
- `test_current_user_dependency_returns_user`: current_user dependency returns user object when valid token is provided.
  - Input: `{'token': 'valid_admin_token'}`
  - Expected: `{'fields': ['id', 'email', 'role']}`
- `test_admin_role_dependency_forbidden_for_customer`: admin_role dependency raises HTTPException 403 for non-admin user.
  - Input: `{'user': {'id': 2, 'role': 'customer'}}`
  - Expected: `{'raises': 'HTTPException', 'status_code': 403}`

### 🔴 TEST — Tests: backend/order-service/main.py
> Ref: §1.1 (modelos de `backend/order-service/main.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/order-service/tests/test_main.py`

**Casos de prueba (implementar todos):**
- `test_healthcheck_returns_200`: GET /healthcheck should return 200 OK with {'status': 'ok'}
  - Expected: `{'status_code': 200, 'json': {'status': 'ok'}}`
- `test_cors_headers_present_on_api_response`: API responses should include CORS headers as configured
  - Input: `{'origin': 'http://localhost:3000'}`
  - Expected: `{'status_code': 200, 'headers': ['access-control-allow-origin']}`
- `test_startup_runs_db_migrations_and_seeding`: On startup, DB migrations and seeding should be executed without error
  - Expected: `{'migrations_run': True, 'seeding_run': True}`

### 🔴 TEST — Tests: backend/order-service/models.py
> Ref: §1.1 (modelos de `backend/order-service/models.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/order-service/tests/test_models.py`

**Casos de prueba (implementar todos):**
- `test_order_create_request_validates_items`: OrderCreateRequest should validate that 'items' is a non-empty list of OrderItemRequest objects
  - Input: `{'items': [{'product_id': 1, 'quantity': 2}]}`
  - Expected: `{'valid': True}`
- `test_order_create_request_empty_items_invalid`: OrderCreateRequest with empty 'items' list should raise validation error
  - Input: `{'items': []}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_order_item_request_negative_quantity_invalid`: OrderItemRequest with negative quantity should raise validation error
  - Input: `{'product_id': 1, 'quantity': -1}`
  - Expected: `{'raises': 'ValidationError'}`

### 🔴 TEST — Tests: backend/order-service/db.py
> Ref: §1.1 (modelos de `backend/order-service/db.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/order-service/tests/test_db.py`

**Casos de prueba (implementar todos):**
- `test_order_and_orderitem_models_create_and_query`: Order and OrderItem SQLAlchemy models can be created and queried from the database
  - Input: `{'order': {'user_id': 1, 'status': 'pending', 'items': [{'product_id': 1, 'quantity': 2, 'price': 10.0}]}}`
  - Expected: `{'order_found': True, 'order_items_count': 1}`
- `test_order_model_requires_user_id`: Order model should not allow creation without user_id (NOT NULL constraint)
  - Input: `{'order': {'status': 'pending'}}`
  - Expected: `{'raises': 'IntegrityError'}`
- `test_orderitem_model_quantity_must_be_positive`: OrderItem model should not allow negative or zero quantity
  - Input: `{'order_item': {'order_id': 1, 'product_id': 1, 'quantity': 0, 'price': 10.0}}`
  - Expected: `{'raises': 'IntegrityError'}`

### 🔴 TEST — Tests: backend/order-service/crud.py
> Ref: §1.1 (modelos de `backend/order-service/crud.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/order-service/tests/test_crud.py`

**Casos de prueba (implementar todos):**
- `test_add_item_to_cart_in_redis_happy_path`: Adding an item to the cart in Redis should store the item with correct quantity
  - Input: `{'user_id': 1, 'product_id': 2, 'quantity': 3}`
  - Expected: `{'cart_contains': [{'product_id': 2, 'quantity': 3}]}`
- `test_add_item_to_cart_negative_quantity_error`: Adding an item with negative quantity to the cart should raise a validation error
  - Input: `{'user_id': 1, 'product_id': 2, 'quantity': -1}`
  - Expected: `{'raises': 'ValueError'}`
- `test_create_order_with_stock_validation_success`: Creating an order should validate stock via Product Service and succeed if stock is sufficient
  - Input: `{'user_id': 1, 'items': [{'product_id': 1, 'quantity': 2}], 'mock_product_service': {'product_id': 1, 'stock': 5}}`
  - Expected: `{'order_created': True, 'order_status': 'pending'}`
- `test_create_order_with_insufficient_stock_fails`: Creating an order should fail with 400 if Product Service reports insufficient stock
  - Input: `{'user_id': 1, 'items': [{'product_id': 1, 'quantity': 10}], 'mock_product_service': {'product_id': 1, 'stock': 5}}`
  - Expected: `{'raises': 'HTTPException', 'status_code': 400, 'detail': 'Insufficient stock for product_id 1'}`
- `test_clear_cart_removes_all_items`: Clearing the cart should remove all items for the user in Redis
  - Input: `{'user_id': 1}`
  - Expected: `{'cart_empty': True}`

### 🔴 TEST — Tests: backend/order-service/routes.py
> Ref: §1.1 (modelos de `backend/order-service/routes.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/order-service/tests/test_routes.py`

**Casos de prueba (implementar todos):**
- `test_get_cart_returns_cart_items`: GET /cart should return 200 and the current user's cart items from Redis
  - Input: `{'auth_user_id': 1, 'cart_items': [{'product_id': 1, 'quantity': 2}]}`
  - Expected: `{'status_code': 200, 'json': {'items': [{'product_id': 1, 'quantity': 2}]}}`
- `test_post_cart_items_adds_item_to_cart`: POST /cart/items should add an item to the cart and return updated cart
  - Input: `{'auth_user_id': 1, 'body': {'product_id': 2, 'quantity': 3}}`
  - Expected: `{'status_code': 200, 'json': {'items': [{'product_id': 2, 'quantity': 3}]}}`
- `test_post_cart_items_missing_quantity_returns_422`: POST /cart/items without 'quantity' should return 422 Unprocessable Entity
  - Input: `{'auth_user_id': 1, 'body': {'product_id': 2}}`
  - Expected: `{'status_code': 422}`
- `test_post_orders_creates_order_and_clears_cart`: POST /orders should create an order, validate stock, and clear the cart on success
  - Input: `{'auth_user_id': 1, 'cart_items': [{'product_id': 1, 'quantity': 2}], 'mock_product_service': {'product_id': 1, 'stock': 5}}`
  - Expected: `{'status_code': 200, 'json': {'status': 'pending', 'items': [{'product_id': 1, 'quantity': 2}]}, 'cart_empty': True}`
- `test_post_orders_insufficient_stock_returns_400`: POST /orders should return 400 if Product Service reports insufficient stock
  - Input: `{'auth_user_id': 1, 'cart_items': [{'product_id': 1, 'quantity': 10}], 'mock_product_service': {'product_id': 1, 'stock': 5}}`
  - Expected: `{'status_code': 400, 'json': {'detail': 'Insufficient stock for product_id 1'}}`
- `test_get_orders_returns_user_orders`: GET /orders should return 200 and a list of the current user's orders
  - Input: `{'auth_user_id': 1, 'orders': [{'id': 1, 'status': 'pending', 'items': [{'product_id': 1, 'quantity': 2}]}]}`
  - Expected: `{'status_code': 200, 'json': {'orders': [{'id': 1, 'status': 'pending', 'items': [{'product_id': 1, 'quantity': 2}]}]}}`
- `test_get_orders_unauthenticated_returns_401`: GET /orders without authentication should return 401 Unauthorized
  - Expected: `{'status_code': 401}`
- `test_get_order_detail_returns_order`: GET /orders/{id} should return 200 and the order detail for the current user
  - Input: `{'auth_user_id': 1, 'order_id': 1, 'order': {'id': 1, 'status': 'pending', 'items': [{'product_id': 1, 'quantity': 2}]}}`
  - Expected: `{'status_code': 200, 'json': {'id': 1, 'status': 'pending', 'items': [{'product_id': 1, 'quantity': 2}]}}`
- `test_get_order_detail_not_found_returns_404`: GET /orders/{id} for a non-existent order should return 404 Not Found
  - Input: `{'auth_user_id': 1, 'order_id': 999}`
  - Expected: `{'status_code': 404, 'json': {'detail': 'Order not found'}}`
- `test_patch_order_status_admin_only_success`: PATCH /orders/{id}/status as admin should update order status and return updated order
  - Input: `{'auth_user_id': 2, 'auth_user_role': 'admin', 'order_id': 1, 'body': {'status': 'shipped'}, 'order': {'id': 1, 'status': 'pending'}}`
  - Expected: `{'status_code': 200, 'json': {'id': 1, 'status': 'shipped'}}`

### 🔴 TEST — Tests: backend/order-service/dependencies.py
> Ref: §1.1 (modelos de `backend/order-service/dependencies.py`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `backend/order-service/tests/test_dependencies.py`

**Casos de prueba (implementar todos):**
- `test_get_db_dependency_yields_session`: get_db dependency should yield a valid SQLAlchemy session
  - Expected: `{'session_type': 'AsyncSession'}`
- `test_current_user_dependency_returns_user`: current_user dependency should return the authenticated user object from token
  - Input: `{'access_token': 'valid_token_for_user_1'}`
  - Expected: `{'user_id': 1, 'role': 'customer'}`
- `test_admin_role_dependency_raises_for_non_admin`: admin_role dependency should raise HTTPException 403 if user is not admin
  - Input: `{'user': {'id': 1, 'role': 'customer'}}`
  - Expected: `{'raises': 'HTTPException', 'status_code': 403, 'detail': 'Admin privileges required'}`

### 🔴 TEST — Tests: frontend/src/main.jsx
> Ref: §1.1 (modelos de `frontend/src/main.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/main.test.jsx`

**Casos de prueba (implementar todos):**
- `renders root App component without crashing`: The React entrypoint should render the App component without throwing errors.
  - Expected: `{'renders': 'App'}`
- `renders loading indicator before App is ready`: Should display a loading indicator or fallback UI while App is loading.
  - Expected: `{'renders': 'loading indicator'}`
- `handles React hydration errors gracefully`: If hydration fails, the entrypoint should not crash the SPA.
  - Expected: `{'no_unhandled_errors': True}`

### 🔴 TEST — Tests: frontend/src/App.jsx
> Ref: §1.1 (modelos de `frontend/src/App.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/App.test.jsx`

**Casos de prueba (implementar todos):**
- `renders all main routes correctly`: Navigating to each main route (/, /products, /cart, /orders, /admin) should render the correct page component.
  - Input: `{'routes': ['/', '/products', '/cart', '/orders', '/admin']}`
  - Expected: `{'renders': ['LandingPage', 'ProductList', 'CartPage', 'OrderHistory', 'AdminPanel']}`
- `redirects unauthenticated user from protected routes`: Unauthenticated users should be redirected to /login when accessing protected routes like /orders or /admin.
  - Input: `{'route': '/orders', 'auth': False}`
  - Expected: `{'redirects_to': '/login'}`
- `shows 404 page for unknown routes`: Navigating to an unknown route should render the NotFound page.
  - Input: `{'route': '/unknown'}`
  - Expected: `{'renders': 'NotFound'}`

### 🔴 TEST — Tests: frontend/src/api/auth.js
> Ref: §1.1 (modelos de `frontend/src/api/auth.js`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/api/auth.test.jsx`

**Casos de prueba (implementar todos):**
- `registers user with valid data`: POST /auth/register with valid email, password, and name returns 200 and user info.
  - Input: `{'email': 'test@example.com', 'password': 'StrongPass123', 'name': 'Test User'}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'email', 'name', 'role']}`
- `fails registration with missing email`: POST /auth/register without email returns 422 Unprocessable Entity.
  - Input: `{'password': 'StrongPass123', 'name': 'Test User'}`
  - Expected: `{'status_code': 422}`
- `login returns tokens for valid credentials`: POST /auth/login with valid credentials returns 200 and access_token, refresh_token.
  - Input: `{'email': 'test@example.com', 'password': 'StrongPass123'}`
  - Expected: `{'status_code': 200, 'fields': ['access_token', 'refresh_token', 'token_type']}`
- `login fails with invalid password`: POST /auth/login with wrong password returns 401 Unauthorized.
  - Input: `{'email': 'test@example.com', 'password': 'wrong'}`
  - Expected: `{'status_code': 401}`
- `refresh returns new access token`: POST /auth/refresh with valid refresh_token returns 200 and new access_token.
  - Input: `{'refresh_token': 'valid_refresh_token'}`
  - Expected: `{'status_code': 200, 'fields': ['access_token', 'token_type']}`
- `profile returns user info when authenticated`: GET /auth/me with valid Bearer token returns 200 and user profile.
  - Input: `{'auth': 'Bearer valid_access_token'}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'email', 'name', 'role']}`
- `profile fails without authentication`: GET /auth/me without Bearer token returns 401 Unauthorized.
  - Expected: `{'status_code': 401}`

### 🔴 TEST — Tests: frontend/src/api/product.js
> Ref: §1.1 (modelos de `frontend/src/api/product.js`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/api/product.test.jsx`

**Casos de prueba (implementar todos):**
- `fetches product list successfully`: GET /products returns 200 and a list of products.
  - Expected: `{'status_code': 200, 'fields': ['products']}`
- `fetches product detail by id`: GET /products/{id} returns 200 and product details for valid id.
  - Input: `{'id': 1}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock']}`
- `returns 404 for non-existent product id`: GET /products/{id} with invalid id returns 404 Not Found.
  - Input: `{'id': 99999}`
  - Expected: `{'status_code': 404}`
- `admin can create product with valid data`: POST /products as admin with valid data returns 200 and product info.
  - Input: `{'auth': 'Bearer admin_token', 'body': {'name': 'New Product', 'description': 'A product', 'price': 10.5, 'stock': 100}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'name', 'description', 'price', 'stock']}`
- `fails to create product with missing name`: POST /products with missing name returns 422 Unprocessable Entity.
  - Input: `{'auth': 'Bearer admin_token', 'body': {'description': 'A product', 'price': 10.5, 'stock': 100}}`
  - Expected: `{'status_code': 422}`
- `non-admin cannot create product`: POST /products as non-admin returns 403 Forbidden.
  - Input: `{'auth': 'Bearer user_token', 'body': {'name': 'New Product', 'description': 'A product', 'price': 10.5, 'stock': 100}}`
  - Expected: `{'status_code': 403}`

### 🔴 TEST — Tests: frontend/src/api/order.js
> Ref: §1.1 (modelos de `frontend/src/api/order.js`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/api/order.test.jsx`

**Casos de prueba (implementar todos):**
- `fetches order history for authenticated user`: GET /orders with valid Bearer token returns 200 and list of orders.
  - Input: `{'auth': 'Bearer valid_access_token'}`
  - Expected: `{'status_code': 200, 'fields': ['orders']}`
- `returns 401 for order history without authentication`: GET /orders without Bearer token returns 401 Unauthorized.
  - Expected: `{'status_code': 401}`
- `creates order with valid cart items`: POST /orders with valid items returns 200 and order details.
  - Input: `{'auth': 'Bearer valid_access_token', 'body': {'items': [{'product_id': 1, 'quantity': 2}]}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'items', 'total', 'status']}`
- `fails to create order with missing items`: POST /orders with missing items returns 422 Unprocessable Entity.
  - Input: `{'auth': 'Bearer valid_access_token', 'body': {}}`
  - Expected: `{'status_code': 422}`
- `returns 404 for non-existent order id`: GET /orders/{id} with invalid id returns 404 Not Found.
  - Input: `{'auth': 'Bearer valid_access_token', 'id': 99999}`
  - Expected: `{'status_code': 404}`

### 🔴 TEST — Tests: frontend/src/hooks/useAuth.js
> Ref: §1.1 (modelos de `frontend/src/hooks/useAuth.js`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/hooks/useAuth.test.jsx`

**Casos de prueba (implementar todos):**
- `returns user and token after successful login`: useAuth hook should update user and token state after login with valid credentials.
  - Input: `{'login': {'email': 'test@example.com', 'password': 'StrongPass123'}}`
  - Expected: `{'user': {'email': 'test@example.com'}, 'token': 'non-empty'}`
- `clears user and token on logout`: useAuth hook should clear user and token state after logout.
  - Input: `{'login': {'email': 'test@example.com', 'password': 'StrongPass123'}, 'logout': True}`
  - Expected: `{'user': None, 'token': None}`
- `handles registration errors`: useAuth hook should set error state if registration fails due to missing fields.
  - Input: `{'register': {'password': 'StrongPass123'}}`
  - Expected: `{'error': True}`

### 🔴 TEST — Tests: frontend/src/hooks/useProducts.js
> Ref: §1.1 (modelos de `frontend/src/hooks/useProducts.js`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/hooks/useProducts.test.jsx`

**Casos de prueba (implementar todos):**
- `fetches and sets product list on mount`: useProducts hook should fetch and set the product list when mounted.
  - Expected: `{'products': 'array'}`
- `applies search filter correctly`: useProducts hook should filter products by search term.
  - Input: `{'search': 'laptop'}`
  - Expected: `{'products': 'filtered by search'}`
- `handles API error gracefully`: useProducts hook should set error state if API call fails.
  - Input: `{'api_error': True}`
  - Expected: `{'error': True}`

### 🔴 TEST — Tests: frontend/src/hooks/useOrders.js
> Ref: §1.1 (modelos de `frontend/src/hooks/useOrders.js`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/hooks/useOrders.test.jsx`

**Casos de prueba (implementar todos):**
- `fetches order history on mount`: useOrders hook should fetch and set order history when mounted.
  - Expected: `{'orders': 'array'}`
- `fetches order detail by id`: useOrders hook should fetch and set order detail for a given id.
  - Input: `{'orderId': 1}`
  - Expected: `{'order': {'id': 1}}`
- `handles error when fetching non-existent order`: useOrders hook should set error state if order id does not exist.
  - Input: `{'orderId': 99999}`
  - Expected: `{'error': True}`

### 🔴 TEST — Tests: frontend/src/components/Auth/LoginForm.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Auth/LoginForm.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Auth/LoginForm.test.jsx`

**Casos de prueba (implementar todos):**
- `submits login form with valid credentials`: Submitting the login form with valid email and password calls login API and redirects on success.
  - Input: `{'email': 'test@example.com', 'password': 'StrongPass123'}`
  - Expected: `{'calls_api': True, 'redirects': True}`
- `shows validation error for missing email`: Submitting the login form without email shows a validation error.
  - Input: `{'password': 'StrongPass123'}`
  - Expected: `{'shows_error': 'email'}`
- `shows API error for invalid credentials`: Submitting the login form with wrong password shows an authentication error message.
  - Input: `{'email': 'test@example.com', 'password': 'wrong'}`
  - Expected: `{'shows_error': 'authentication'}`

### 🔴 TEST — Tests: frontend/src/components/Auth/RegisterForm.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Auth/RegisterForm.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Auth/RegisterForm.test.jsx`

**Casos de prueba (implementar todos):**
- `submits registration form with valid data`: Submitting the registration form with valid email, password, and name calls register API and redirects on success.
  - Input: `{'email': 'test@example.com', 'password': 'StrongPass123', 'name': 'Test User'}`
  - Expected: `{'calls_api': True, 'redirects': True}`
- `shows validation error for missing password`: Submitting the registration form without password shows a validation error.
  - Input: `{'email': 'test@example.com', 'name': 'Test User'}`
  - Expected: `{'shows_error': 'password'}`
- `shows API error for duplicate email`: Submitting the registration form with an already registered email shows an error message.
  - Input: `{'email': 'existing@example.com', 'password': 'StrongPass123', 'name': 'Test User'}`
  - Expected: `{'shows_error': 'email'}`

### 🔴 TEST — Tests: frontend/src/components/Product/ProductList.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Product/ProductList.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Product/ProductList.test.jsx`

**Casos de prueba (implementar todos):**
- `renders product grid with products`: ProductList should render a grid of products fetched from API.
  - Expected: `{'renders': 'product grid'}`
- `applies category filter`: Selecting a category filter should update the displayed products.
  - Input: `{'category': 'Electronics'}`
  - Expected: `{'products': 'filtered by category'}`
- `shows empty state when no products`: ProductList should display an empty state message if there are no products.
  - Input: `{'products': []}`
  - Expected: `{'renders': 'empty state'}`

### 🔴 TEST — Tests: frontend/src/components/Product/ProductForm.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Product/ProductForm.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Product/ProductForm.test.jsx`

**Casos de prueba (implementar todos):**
- `submits form with valid product data`: Submitting the product form with valid data calls create or update API and shows success.
  - Input: `{'name': 'New Product', 'description': 'A product', 'price': 10.5, 'stock': 100}`
  - Expected: `{'calls_api': True, 'shows_success': True}`
- `shows validation error for missing name`: Submitting the product form without a name shows a validation error.
  - Input: `{'description': 'A product', 'price': 10.5, 'stock': 100}`
  - Expected: `{'shows_error': 'name'}`
- `shows API error for unauthorized user`: Submitting the product form as a non-admin shows an authorization error message.
  - Input: `{'auth': 'Bearer user_token', 'name': 'New Product', 'description': 'A product', 'price': 10.5, 'stock': 100}`
  - Expected: `{'shows_error': 'authorization'}`

### 🔴 TEST — Tests: frontend/src/components/Product/ProductDetail.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Product/ProductDetail.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Product/ProductDetail.test.jsx`

**Casos de prueba (implementar todos):**
- `renders product details with reviews and add-to-cart button`: Should display product name, description, price, stock, reviews, and an enabled add-to-cart button when product data is loaded.
  - Input: `{'product': {'id': 1, 'name': 'Test Product', 'description': 'A test product', 'price': 19.99, 'stock': 5, 'reviews': [{'user': 'Alice', 'rating': 5, 'comment': 'Great!'}]}}`
  - Expected: `{'elements': [{'text': 'Test Product'}, {'text': 'A test product'}, {'text': '$19.99'}, {'text': 'In stock: 5'}, {'text': 'Great!'}, {'role': 'button', 'name': 'Add to Cart', 'enabled': True}]}`
- `disables add-to-cart button when stock is zero`: Should render add-to-cart button as disabled when product stock is 0.
  - Input: `{'product': {'id': 2, 'name': 'Out of Stock Product', 'description': 'No stock', 'price': 10.0, 'stock': 0, 'reviews': []}}`
  - Expected: `{'elements': [{'role': 'button', 'name': 'Add to Cart', 'enabled': False}]}`
- `shows loading state while fetching product`: Should display a loading indicator while product data is being fetched.
  - Input: `{'loading': True}`
  - Expected: `{'elements': [{'role': 'status', 'text': 'Loading...'}]}`

### 🔴 TEST — Tests: frontend/src/components/Order/OrderList.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Order/OrderList.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Order/OrderList.test.jsx`

**Casos de prueba (implementar todos):**
- `renders list of orders for customer`: Should display a list of orders with order id, date, and total for a customer user.
  - Input: `{'orders': [{'id': 1, 'created_at': '2024-06-01', 'total': 100.0}, {'id': 2, 'created_at': '2024-06-02', 'total': 50.0}], 'userRole': 'customer'}`
  - Expected: `{'elements': [{'text': 'Order #1'}, {'text': '2024-06-01'}, {'text': '$100.00'}, {'text': 'Order #2'}, {'text': '2024-06-02'}, {'text': '$50.00'}]}`
- `renders admin order list with user info`: Should display orders with user email and role for admin users.
  - Input: `{'orders': [{'id': 3, 'created_at': '2024-06-03', 'total': 200.0, 'user': {'email': 'bob@test.com', 'role': 'customer'}}], 'userRole': 'admin'}`
  - Expected: `{'elements': [{'text': 'Order #3'}, {'text': 'bob@test.com'}, {'text': 'customer'}]}`
- `shows empty state when no orders`: Should display a message indicating no orders are present when orders array is empty.
  - Input: `{'orders': [], 'userRole': 'customer'}`
  - Expected: `{'elements': [{'text': 'No orders found.'}]}`

### 🔴 TEST — Tests: frontend/src/components/Order/OrderForm.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Order/OrderForm.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Order/OrderForm.test.jsx`

**Casos de prueba (implementar todos):**
- `submits order with valid cart items`: Should call onSubmit with correct order data when form is submitted with valid items.
  - Input: `{'cart': [{'product_id': 1, 'name': 'Product 1', 'price': 10.0, 'quantity': 2}]}`
  - Expected: `{'onSubmitCalledWith': {'items': [{'product_id': 1, 'quantity': 2}]}}`
- `shows validation error when cart is empty`: Should display a validation error if user tries to submit with an empty cart.
  - Input: `{'cart': []}`
  - Expected: `{'elements': [{'role': 'alert', 'text': 'Cart is empty.'}]}`
- `disables submit button during submission`: Should disable the submit button while the order is being submitted.
  - Input: `{'cart': [{'product_id': 2, 'name': 'Product 2', 'price': 20.0, 'quantity': 1}], 'submitting': True}`
  - Expected: `{'elements': [{'role': 'button', 'name': 'Place Order', 'enabled': False}]}`

### 🔴 TEST — Tests: frontend/src/components/Order/OrderDetail.jsx
> Ref: §1.1 (modelos de `frontend/src/components/Order/OrderDetail.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/components/Order/OrderDetail.test.jsx`

**Casos de prueba (implementar todos):**
- `renders order details with items`: Should display order id, date, total, and a list of order items with name, price, and quantity.
  - Input: `{'order': {'id': 10, 'created_at': '2024-06-05', 'total': 150.0, 'items': [{'product_id': 1, 'name': 'Product 1', 'price': 50.0, 'quantity': 2}]}}`
  - Expected: `{'elements': [{'text': 'Order #10'}, {'text': '2024-06-05'}, {'text': '$150.00'}, {'text': 'Product 1'}, {'text': '2 x $50.00'}]}`
- `shows error message for invalid order id`: Should display an error message if the order id does not exist or fetch fails.
  - Input: `{'order': None, 'error': 'Order not found'}`
  - Expected: `{'elements': [{'role': 'alert', 'text': 'Order not found'}]}`
- `shows loading state while fetching order`: Should display a loading indicator while order data is being fetched.
  - Input: `{'loading': True}`
  - Expected: `{'elements': [{'role': 'status', 'text': 'Loading...'}]}`

### 🔴 TEST — Tests: frontend/src/routes/AuthRoutes.jsx
> Ref: §1.1 (modelos de `frontend/src/routes/AuthRoutes.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/routes/AuthRoutes.test.jsx`

**Casos de prueba (implementar todos):**
- `renders login and register routes for unauthenticated users`: Should render Login and Register pages when user is not authenticated.
  - Input: `{'authenticated': False, 'route': '/login'}`
  - Expected: `{'elements': [{'role': 'heading', 'text': 'Login'}]}`
- `redirects authenticated users away from login/register`: Should redirect authenticated users to the home page if they try to access /login or /register.
  - Input: `{'authenticated': True, 'route': '/login'}`
  - Expected: `{'redirect': '/'}`
- `shows 404 for unknown auth route`: Should display a 404 page for unknown auth-related routes.
  - Input: `{'authenticated': False, 'route': '/auth/unknown'}`
  - Expected: `{'elements': [{'text': '404'}]}`

### 🔴 TEST — Tests: frontend/src/routes/ProductRoutes.jsx
> Ref: §1.1 (modelos de `frontend/src/routes/ProductRoutes.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/routes/ProductRoutes.test.jsx`

**Casos de prueba (implementar todos):**
- `renders product listing page`: Should render the product listing page at /products.
  - Input: `{'route': '/products'}`
  - Expected: `{'elements': [{'role': 'heading', 'text': 'Products'}]}`
- `renders product detail page for valid id`: Should render the product detail page when navigating to /products/:id with a valid id.
  - Input: `{'route': '/products/1'}`
  - Expected: `{'elements': [{'role': 'heading', 'text': 'Product Detail'}]}`
- `shows 404 for invalid product id`: Should display a 404 page when navigating to /products/:id with an invalid id.
  - Input: `{'route': '/products/9999'}`
  - Expected: `{'elements': [{'text': '404'}]}`

### 🔴 TEST — Tests: frontend/src/routes/OrderRoutes.jsx
> Ref: §1.1 (modelos de `frontend/src/routes/OrderRoutes.jsx`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/routes/OrderRoutes.test.jsx`

**Casos de prueba (implementar todos):**
- `renders order history for authenticated customer`: Should render the order history page at /orders for authenticated customer users.
  - Input: `{'authenticated': True, 'userRole': 'customer', 'route': '/orders'}`
  - Expected: `{'elements': [{'role': 'heading', 'text': 'Order History'}]}`
- `renders admin order list for admin users`: Should render the admin order list page at /admin/orders for authenticated admin users.
  - Input: `{'authenticated': True, 'userRole': 'admin', 'route': '/admin/orders'}`
  - Expected: `{'elements': [{'role': 'heading', 'text': 'Admin Orders'}]}`
- `redirects unauthenticated users to login`: Should redirect unauthenticated users to /login when accessing protected order routes.
  - Input: `{'authenticated': False, 'route': '/orders'}`
  - Expected: `{'redirect': '/login'}`

### 🔴 TEST — Tests: frontend/src/utils/storage.js
> Ref: §1.1 (modelos de `frontend/src/utils/storage.js`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/utils/storage.test.jsx`

**Casos de prueba (implementar todos):**
- `sets and gets value from localStorage`: Should store a value in localStorage and retrieve it correctly.
  - Input: `{'key': 'access_token', 'value': 'abc123'}`
  - Expected: `{'get': 'abc123'}`
- `removes value from localStorage`: Should remove a value from localStorage and return null on get.
  - Input: `{'key': 'refresh_token', 'value': 'def456'}`
  - Expected: `{'get': None}`
- `returns null for missing key`: Should return null when getting a key that does not exist in localStorage.
  - Input: `{'key': 'nonexistent'}`
  - Expected: `{'get': None}`

### 🔴 TEST — Tests: frontend/vite.config.js
> Ref: §1.1 (modelos de `frontend/vite.config.js`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/vite.config.test.jsx`

**Casos de prueba (implementar todos):**
- `sets up API proxy for /api routes`: Should configure Vite dev server to proxy /api requests to the backend API URL.
  - Expected: `{'proxy': {'/api': {'target': 'http://localhost:8000', 'changeOrigin': True, 'secure': False}}}`
- `uses correct root directory`: Should set the root directory to 'frontend' for Vite config.
  - Expected: `{'root': 'frontend'}`
- `includes react plugin`: Should include the @vitejs/plugin-react in the Vite plugins array.
  - Expected: `{'plugins': ['@vitejs/plugin-react']}`

### 🔴 TEST — Tests: frontend/index.html
> Ref: §1.1 (modelos de `frontend/index.html`) · §1.2 (endpoints del módulo)
**Archivo a crear:** `frontend/tests/index.test.jsx`

**Casos de prueba (implementar todos):**
- `contains root div for React mounting`: Should contain a <div id="root"></div> for React to mount the app.
  - Expected: `{'html': '<div id="root"></div>'}`
- `includes Vite script for main entry`: Should include a <script type="module" src="/src/main.jsx"></script> for Vite entry.
  - Expected: `{'html': '<script type="module" src="/src/main.jsx"></script>'}`
- `sets correct meta charset`: Should include <meta charset="UTF-8"> in the HTML head.
  - Expected: `{'html': '<meta charset="UTF-8">'}`

### 🟢 PROD — Auth Service — registration, login, JWT, RBAC, profile, logout
> Implement the Auth Service with endpoints for user registration, login, JWT issuance/refresh, RBAC enforcement, profile retrieval, and logout (refresh token invalidation in Redis). Includes DB migrations, seed data (admin and customer users), healthcheck, structured logging, CORS, and Dockerfile.
**Archivos:**
  - `backend/auth-service/main.py`  
  - `backend/auth-service/models.py`  
  - `backend/auth-service/db.py`  
  - `backend/auth-service/crud.py`  
  - `backend/auth-service/routes.py`  
  - `backend/auth-service/auth.py`  
  - `backend/auth-service/dependencies.py`  
  - `backend/auth-service/alembic.ini`


### 🟢 PROD — Product Service — categories, products, reviews, admin CRUD
> Implement the Product Service with endpoints for category and product CRUD, product listing with pagination/filtering, product detail, review creation/listing, and soft delete. Includes DB migrations, seed data (3 categories, 8 products), healthcheck, structured logging, CORS, and Dockerfile.
**Archivos:**
  - `backend/product-service/main.py`  
  - `backend/product-service/models.py`  
  - `backend/product-service/db.py`  
  - `backend/product-service/crud.py`  
  - `backend/product-service/routes.py`  
  - `backend/product-service/dependencies.py`  
  - `backend/product-service/alembic.ini`


### 🟢 PROD — Order Service — cart (Redis), orders, status, admin panel
> Implement the Order Service with endpoints for cart management (Redis), order creation (with stock validation via Product Service HTTP), order listing/detail, and order status updates (admin only). Includes DB migrations, healthcheck, structured logging, CORS, and Dockerfile.
**Archivos:**
  - `backend/order-service/main.py`  
  - `backend/order-service/models.py`  
  - `backend/order-service/db.py`  
  - `backend/order-service/crud.py`  
  - `backend/order-service/routes.py`  
  - `backend/order-service/dependencies.py`  
  - `backend/order-service/alembic.ini`


### 🟢 PROD — Frontend — React SPA (auth, catalog, cart, orders, admin) (1/2)
> Implement the React SPA with all required pages and features: landing, product listing/detail, cart, checkout, order history/detail, login/register, admin product/order panels. Includes hooks for auth, products, cart, orders; API modules; protected routes; and Dockerfile for Vite+nginx.
**Archivos:**
  - `frontend/src/main.jsx`  
  - `frontend/src/App.jsx`  
  - `frontend/src/api/auth.js`  
  - `frontend/src/api/product.js`  
  - `frontend/src/api/order.js`  
  - `frontend/src/hooks/useAuth.js`  
  - `frontend/src/hooks/useProducts.js`  
  - `frontend/src/hooks/useOrders.js`  
  - `frontend/src/components/Auth/LoginForm.jsx`  
  - `frontend/src/components/Auth/RegisterForm.jsx`  
  - `frontend/src/components/Product/ProductList.jsx`  
  - `frontend/src/components/Product/ProductForm.jsx`


### 🟢 PROD — Frontend — React SPA (auth, catalog, cart, orders, admin) (2/2)
> Implement the React SPA with all required pages and features: landing, product listing/detail, cart, checkout, order history/detail, login/register, admin product/order panels. Includes hooks for auth, products, cart, orders; API modules; protected routes; and Dockerfile for Vite+nginx.
**Archivos:**
  - `frontend/src/components/Product/ProductDetail.jsx`  
  - `frontend/src/components/Order/OrderList.jsx`  
  - `frontend/src/components/Order/OrderForm.jsx`  
  - `frontend/src/components/Order/OrderDetail.jsx`  
  - `frontend/src/routes/AuthRoutes.jsx`  
  - `frontend/src/routes/ProductRoutes.jsx`  
  - `frontend/src/routes/OrderRoutes.jsx`  
  - `frontend/src/utils/storage.js`  
  - `frontend/vite.config.js`  
  - `frontend/index.html`


## Wave 3

### 🟢 PROD — Infrastructure & Deployment
> Complete Docker orchestration for all services and databases. Includes docker-compose.yml with healthchecks, .env.example, .gitignore, .dockerignore, run.sh (builds, starts, waits healthy, prints URLs), README.md (setup, usage, endpoints), and docs/architecture.md (system diagram and component descriptions).
**Archivos:**
  - `docker-compose.yml`  
  - `run.sh`  
  - `README.md`


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