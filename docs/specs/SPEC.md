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