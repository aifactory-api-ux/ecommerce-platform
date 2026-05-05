#!/bin/bash
set -e

echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed"
    exit 1
fi

if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed"
    exit 1
fi

echo "Building images..."
docker compose build

echo "Starting services..."
docker compose up -d

echo "Waiting for services to be healthy..."
services=("auth-service" "product-service" "order-service" "frontend")
for service in "${services[@]}"; do
    echo "Waiting for $service..."
    count=0
    while [ $count -lt 60 ]; do
        status=$(docker compose ps $service --format "{{.Health}}")
        if [ "$status" == "healthy" ]; then
            echo "$service is healthy"
            break
        fi
        sleep 2
        count=$((count+1))
    done
    if [ $count -eq 60 ]; then
        echo "Timeout waiting for $service to become healthy"
        exit 1
    fi
done

echo ""
echo "Services are ready!"
echo "Auth Service: http://localhost:23001"
echo "Product Service: http://localhost:23002"
echo "Order Service: http://localhost:23003"
echo "Frontend: http://localhost:25173"