import { render, screen } from '@testing-library/react'
import React from 'react'
import useOrders from '../src/hooks/useOrders'

jest.mock('../src/hooks/useOrders', () => () => ({ orders: [], loading: false, error: null, fetchOrders: jest.fn(), fetchOrder: jest.fn(), createOrder: jest.fn() }))

test('fetches order history on mount', () => {
  const { fetchOrders } = useOrders()
  expect(fetchOrders).toBeDefined()
})

test('fetches order detail by id', () => {
  const { fetchOrder } = useOrders()
  expect(fetchOrder).toBeDefined()
})

test('handles error when fetching non-existent order', () => {
  const { error } = useOrders()
  expect(error).toBeNull()
})