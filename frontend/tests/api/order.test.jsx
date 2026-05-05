import { render } from '@testing-library/react'
import React from 'react'
import axios from 'axios'

jest.mock('axios')

import { fetchOrders, fetchOrder, createOrder } from '../src/api/order'

test('fetches order history for authenticated user', async () => {
  axios.get.mockResolvedValue({ data: { orders: [] } })
  const result = await fetchOrders('valid_token')
  expect(result.orders).toBeDefined()
})

test('returns 401 for order history without authentication', async () => {
  axios.get.mockRejectedValue({ response: { status: 401 } })
  await expect(fetchOrders('')).rejects.toBeDefined()
})

test('creates order with valid cart items', async () => {
  axios.post.mockResolvedValue({ data: { id: 1, items: [], total: 100, status: 'pending' } })
  const result = await createOrder({ items: [{ product_id: 1, quantity: 2 }] }, 'valid_token')
  expect(result.id).toBe(1)
})

test('fails to create order with missing items', async () => {
  axios.post.mockRejectedValue({ response: { status: 422 } })
  await expect(createOrder({}, 'valid_token')).rejects.toBeDefined()
})

test('returns 404 for non-existent order id', async () => {
  axios.get.mockRejectedValue({ response: { status: 404 } })
  await expect(fetchOrder(99999, 'valid_token')).rejects.toBeDefined()
})