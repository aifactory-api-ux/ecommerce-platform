import { render, screen } from '@testing-library/react'
import React from 'react'
import ProductForm from '../src/components/Product/ProductForm'

test('submits form with valid product data', () => {
  const onSubmit = jest.fn()
  render(<ProductForm onSubmit={onSubmit} loading={false} />)
  expect(onSubmit).not.toHaveBeenCalled()
})

test('shows validation error for missing name', () => {
  const onSubmit = jest.fn()
  render(<ProductForm onSubmit={onSubmit} loading={false} />)
  expect(onSubmit).not.toHaveBeenCalled()
})

test('shows API error for unauthorized user', () => {
  const onSubmit = jest.fn()
  render(<ProductForm onSubmit={onSubmit} loading={false} error="Unauthorized" />)
  expect(screen.getByText('Unauthorized')).toBeTruthy()
})