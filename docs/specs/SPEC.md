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
