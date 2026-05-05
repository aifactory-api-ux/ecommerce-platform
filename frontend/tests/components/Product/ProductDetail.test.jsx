import { render, screen } from '@testing-library/react'
import React from 'react'
import ProductDetail from '../src/components/Product/ProductDetail'

test('renders product details with reviews and add-to-cart button', () => {
  const product = { id: 1, name: 'Test Product', description: 'A test product', price: 19.99, stock: 5, reviews: [] }
  render(<ProductDetail product={product} onAddToCart={jest.fn()} />)
  expect(screen.getByText('Test Product')).toBeTruthy()
})

test('disables add-to-cart button when stock is zero', () => {
  const product = { id: 2, name: 'Out of Stock', description: 'No stock', price: 10, stock: 0, reviews: [] }
  render(<ProductDetail product={product} onAddToCart={jest.fn()} />)
  expect(screen.getByRole('button')).toBeDisabled()
})

test('shows loading state while fetching product', () => {
  render(<ProductDetail product={null} onAddToCart={jest.fn()} />)
  expect(screen.getByText('Loading...')).toBeTruthy()
})