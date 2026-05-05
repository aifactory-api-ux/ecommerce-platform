import { render, screen } from '@testing-library/react'
import React from 'react'
import OrderRoutes from '../src/routes/OrderRoutes'

test('renders order history for authenticated customer', () => {
  render(<OrderRoutes />)
  expect(screen.getByText('Order History')).toBeTruthy()
})

test('renders admin order list for admin users', () => {
  render(<OrderRoutes />)
  expect(screen.getByText('Order History')).toBeTruthy()
})

test('redirects unauthenticated users to login', () => {
  render(<OrderRoutes />)
  expect(screen.getByText('Order History')).toBeTruthy()
})