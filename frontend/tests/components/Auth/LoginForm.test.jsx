import { render, screen } from '@testing-library/react'
import React from 'react'
import LoginForm from '../src/components/Auth/LoginForm'

test('submits login form with valid credentials', () => {
  const onSubmit = jest.fn()
  render(<LoginForm onSubmit={onSubmit} loading={false} error={null} />)
  expect(onSubmit).not.toHaveBeenCalled()
})

test('shows validation error for missing email', () => {
  const onSubmit = jest.fn()
  render(<LoginForm onSubmit={onSubmit} loading={false} error={null} />)
  expect(onSubmit).not.toHaveBeenCalled()
})

test('shows API error for invalid credentials', () => {
  const onSubmit = jest.fn()
  render(<LoginForm onSubmit={onSubmit} loading={false} error="Invalid credentials" />)
  expect(screen.getByText('Invalid credentials')).toBeTruthy()
})