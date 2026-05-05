# System Architecture

## Services

### auth-service (port 23001)

Handles user authentication, registration, login, JWT token management, and user profile operations.

### product-service (port 23002)

Manages products, categories, and reviews. Provides CRUD operations for products with admin-only write access.

### order-service (port 23003)

Manages shopping cart (Redis), orders, and order status updates.

### frontend

React SPA for the customer interface.

## Infrastructure

### PostgreSQL

Each service has its own PostgreSQL database:
- auth-postgres: Users and authentication data
- product-postgres: Products and categories
- order-postgres: Orders and order items

### Redis

Used by order-service for shopping cart management.

## System Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│ auth-service│────▶│auth-postgres│
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Redis    │
                    └─────────────┘
                           ▲
                           │
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│product-service│───▶│product-postgres
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│ order-service│────▶│order-postgres
└─────────────┘     └─────────────┘     └─────────────┘
```