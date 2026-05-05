import { render, screen } from '@testing-library/react'
import React from 'react'
import OrderDetail from '../src/components/Order/OrderDetail'

test('renders order details with items', () => {
  const order = { id: 10, created_at: '2024-06-05', total: 150.0, status: 'pending', items: [{ product_id: 1, name: 'Product 1', price: 50.0, quantity: 2 }] }
  render(<OrderDetail order={order} />)
  expect(screen.getByText('Order #10')).toBeTruthy()
})

test('shows error message for invalid order id', () => {
  render(<OrderDetail order={null} error="Order not found" />)
  expect(screen.getByText('Order not found')).toBeTruthy()
})

test('shows loading state while fetching order', () => {
  render(<OrderDetail order={null} loading={true} />)
  expect(screen.getByText('Loading...')).toBeTruthy()
})