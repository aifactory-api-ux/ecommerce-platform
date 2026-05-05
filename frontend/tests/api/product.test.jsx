import { render } from '@testing-library/react'
import React from 'react'
import axios from 'axios'

jest.mock('axios')

import { fetchProducts, fetchProduct, createProduct } from '../src/api/product'

test('fetches product list successfully', async () => {
  axios.get.mockResolvedValue({ data: { products: [] } })
  const result = await fetchProducts()
  expect(result.products).toBeDefined()
})

test('fetches product detail by id', async () => {
  axios.get.mockResolvedValue({ data: { id: 1, name: 'Product', description: 'Desc', price: 10, stock: 5 } })
  const result = await fetchProduct(1)
  expect(result.id).toBe(1)
})

test('returns 404 for non-existent product id', async () => {
  axios.get.mockRejectedValue({ response: { status: 404 } })
  await expect(fetchProduct(99999)).rejects.toBeDefined()
})

test('admin can create product with valid data', async () => {
  axios.post.mockResolvedValue({ data: { id: 1, name: 'New Product', description: 'A product', price: 10.5, stock: 100 } })
  const result = await createProduct({ name: 'New Product', description: 'A product', price: 10.5, stock: 100 }, 'admin_token')
  expect(result.name).toBe('New Product')
})

test('fails to create product with missing name', async () => {
  axios.post.mockRejectedValue({ response: { status: 422 } })
  await expect(createProduct({ description: 'A product', price: 10.5, stock: 100 }, 'admin_token')).rejects.toBeDefined()
})

test('non-admin cannot create product', async () => {
  axios.post.mockRejectedValue({ response: { status: 403 } })
  await expect(createProduct({ name: 'New Product', description: 'A product', price: 10.5, stock: 100 }, 'user_token')).rejects.toBeDefined()
})