import { render, screen } from '@testing-library/react'
import React from 'react'
import OrderList from '../src/components/Order/OrderList'

test('renders list of orders for customer', () => {
  const orders = [{ id: 1, created_at: '2024-06-01', total: 100.0, status: 'pending', items: [] }]
  render(<OrderList orders={orders} loading={false} />)
  expect(screen.getByText('Order #1')).toBeTruthy()
})

test('renders admin order list with user info', () => {
  const orders = [{ id: 3, created_at: '2024-06-03', total: 200.0, status: 'pending', user: { email: 'bob@test.com', role: 'customer' }, items: [] }]
  render(<OrderList orders={orders} loading={false} />)
  expect(screen.getByText('bob@test.com')).toBeTruthy()
})

test('shows empty state when no orders', () => {
  render(<OrderList orders={[]} loading={false} />)
  expect(screen.getByText('No orders found.')).toBeTruthy()
})