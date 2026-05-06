# E-Commerce Platform

A full-stack e-commerce application with FastAPI microservices and React frontend.

## Quick Start

```bash
docker-compose up -d
```

That's it! All services will be running with sample data.

## Services

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:24000 | 24000 |
| Auth Service | http://localhost:23001 | 23001 |
| Product Service | http://localhost:23002 | 23002 |
| Order Service | http://localhost:23003 | 23003 |
| PostgreSQL | localhost:25432 | 25432 |
| Redis | localhost:26379 | 26379 |

## Tech Stack

- **Backend**: Python 3.11, FastAPI 0.110.0, SQLAlchemy 2.0.29, PostgreSQL 15, Redis 7.2
- **Frontend**: React 18.2.0, Vite 5.1.0, React Router DOM 6.22.3
- **Infrastructure**: Docker 26.0.0, Docker Compose 2.26.1

## Default Users

- Admin: `admin@example.com` / `admin123`
- Customer: Register through the app