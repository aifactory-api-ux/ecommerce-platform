-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status VARCHAR DEFAULT 'pending',
    total NUMERIC(10, 2) DEFAULT 0,
    items JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data for products (if table is empty)
INSERT INTO products (name, description, price, stock)
SELECT 'Classic T-Shirt', 'Comfortable cotton t-shirt in various colors', 19.99, 100
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

INSERT INTO products (name, description, price, stock)
SELECT 'Denim Jeans', 'Classic fit denim jeans', 49.99, 50
WHERE NOT EXISTS (SELECT 1 FROM products OFFSET 1 LIMIT 1);

INSERT INTO products (name, description, price, stock)
SELECT 'Running Shoes', 'Lightweight running shoes', 79.99, 30
WHERE NOT EXISTS (SELECT 1 FROM products OFFSET 2 LIMIT 1);

INSERT INTO products (name, description, price, stock)
SELECT 'Leather Wallet', 'Genuine leather wallet', 39.99, 75
WHERE NOT EXISTS (SELECT 1 FROM products OFFSET 3 LIMIT 1);

INSERT INTO products (name, description, price, stock)
SELECT 'Sunglasses', 'UV protection sunglasses', 24.99, 60
WHERE NOT EXISTS (SELECT 1 FROM products OFFSET 4 LIMIT 1);

-- Seed admin user (password: admin123)
INSERT INTO users (email, hashed_password, name, role)
SELECT 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4rS4j0f0d0LHAkCO', 'Admin User', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');