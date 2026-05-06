#!/bin/bash
set -e

echo "Starting services..."
docker-compose up -d

echo "Waiting for services to be healthy..."
sleep 10

echo "All services started successfully!"
echo "Auth Service: http://localhost:23001"
echo "Product Service: http://localhost:23002"
echo "Order Service: http://localhost:23003"
echo "Frontend: http://localhost:24000"