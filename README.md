# E-Commerce Platform

## Prerequisites

- Docker 26.0.0+
- Docker Compose 2.27.0+
- Node.js 18+ (for local frontend development)

## Clone

```bash
git clone <repository-url>
cd <repository-name>
```

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Start all services:
```bash
./run.sh
```

## API Endpoints

### Auth Service (port 23001)

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login |
| POST | /auth/refresh | Refresh token |
| GET | /auth/me | Get profile |

### Product Service (port 23002)

| Method | Path | Description |
|--------|------|-------------|
| POST | /products | Create product (admin) |
| GET | /products | List products |
| GET | /products/{id} | Get product |
| PUT | /products/{id} | Update product (admin) |
| DELETE | /products/{id} | Delete product (admin) |

### Order Service (port 23003)

| Method | Path | Description |
|--------|------|-------------|
| POST | /orders | Create order |
| GET | /orders | List orders |
| GET | /orders/{id} | Get order |

## Troubleshooting

### Database connection errors

Ensure PostgreSQL containers are healthy before services start. Restart services if needed:

```bash
docker compose restart
```

### Port conflicts

If ports are already in use, modify the port mappings in `docker-compose.yml`.