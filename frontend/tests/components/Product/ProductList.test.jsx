import { render, screen } from '@testing-library/react'
import React from 'react'
import ProductList from '../src/components/Product/ProductList'

test('renders product grid with products', () => {
  render(<ProductList products={[]} onEdit={jest.fn()} onDelete={jest.fn()} loading={false} />)
  expect(screen.getByText('No products found.')).toBeTruthy()
})

test('applies category filter', () => {
  const products = [{ id: 1, name: 'Laptop', description: 'Desc', price: 999, stock: 5 }]
  render(<ProductList products={products} onEdit={jest.fn()} onDelete={jest.fn()} loading={false} />)
  expect(screen.getByText('Laptop')).toBeTruthy()
})

test('shows empty state when no products', () => {
  render(<ProductList products={[]} onEdit={jest.fn()} onDelete={jest.fn()} loading={false} />)
  expect(screen.getByText('No products found.')).toBeTruthy()
})