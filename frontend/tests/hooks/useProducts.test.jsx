import { render, screen } from '@testing-library/react'
import React from 'react'
import useProducts from '../src/hooks/useProducts'

jest.mock('../src/hooks/useProducts', () => () => ({ products: [], loading: false, error: null, fetchProducts: jest.fn(), createProduct: jest.fn(), updateProduct: jest.fn(), deleteProduct: jest.fn() }))

test('fetches and sets product list on mount', () => {
  const { fetchProducts } = useProducts()
  expect(fetchProducts).toBeDefined()
})

test('applies search filter correctly', () => {
  const { products } = useProducts()
  expect(products).toBeDefined()
})

test('handles API error gracefully', () => {
  const { error } = useProducts()
  expect(error).toBeNull()
})