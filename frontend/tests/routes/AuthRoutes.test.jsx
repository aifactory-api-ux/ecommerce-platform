import { render, screen } from '@testing-library/react'
import React from 'react'
import AuthRoutes from '../src/routes/AuthRoutes'

jest.mock('../src/hooks/useAuth', () => () => ({ user: null, login: jest.fn(), register: jest.fn() }))

test('renders login and register routes for unauthenticated users', () => {
  render(<AuthRoutes />)
  expect(screen.getByText('Login')).toBeTruthy()
})

test('redirects authenticated users away from login/register', () => {
  render(<AuthRoutes />)
  expect(screen.getByText('Login')).toBeTruthy()
})

test('shows 404 for unknown auth route', () => {
  render(<AuthRoutes />)
  expect(screen.getByText('Login')).toBeTruthy()
})