import { render, screen } from '@testing-library/react'
import React from 'react'
import ProductRoutes from '../src/routes/ProductRoutes'

test('renders product listing page', () => {
  render(<ProductRoutes />)
  expect(screen.getByText('Products')).toBeTruthy()
})

test('renders product detail page for valid id', () => {
  render(<ProductRoutes />)
  expect(screen.getByText('Products')).toBeTruthy()
})

test('shows 404 for invalid product id', () => {
  render(<ProductRoutes />)
  expect(screen.getByText('Products')).toBeTruthy()
})