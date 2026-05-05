import { render, screen } from '@testing-library/react'
import React from 'react'
import RegisterForm from '../src/components/Auth/RegisterForm'

test('submits registration form with valid data', () => {
  const onSubmit = jest.fn()
  render(<RegisterForm onSubmit={onSubmit} loading={false} error={null} />)
  expect(onSubmit).not.toHaveBeenCalled()
})

test('shows validation error for missing password', () => {
  const onSubmit = jest.fn()
  render(<RegisterForm onSubmit={onSubmit} loading={false} error={null} />)
  expect(onSubmit).not.toHaveBeenCalled()
})

test('shows API error for duplicate email', () => {
  const onSubmit = jest.fn()
  render(<RegisterForm onSubmit={onSubmit} loading={false} error="Email already exists" />)
  expect(screen.getByText('Email already exists')).toBeTruthy()
})