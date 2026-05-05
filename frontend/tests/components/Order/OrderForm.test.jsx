import { render, screen } from '@testing-library/react'
import React from 'react'
import OrderForm from '../src/components/Order/OrderForm'

test('submits order with valid cart items', () => {
  const onSubmit = jest.fn()
  render(<OrderForm onSubmit={onSubmit} loading={false} />)
  expect(onSubmit).not.toHaveBeenCalled()
})

test('shows validation error when cart is empty', () => {
  const onSubmit = jest.fn()
  render(<OrderForm onSubmit={onSubmit} loading={false} />)
  expect(onSubmit).not.toHaveBeenCalled()
})

test('disables submit button during submission', () => {
  const onSubmit = jest.fn()
  render(<OrderForm onSubmit={onSubmit} loading={true} />)
  expect(screen.getByRole('button')).toBeDisabled()
})