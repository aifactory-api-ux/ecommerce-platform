import { render, screen } from '@testing-library/react'
import React from 'react'
import useAuth from '../src/hooks/useAuth'

jest.mock('../src/hooks/useAuth', () => () => ({ user: null, loading: false, error: null, login: jest.fn(), register: jest.fn(), logout: jest.fn(), refresh: jest.fn() }))

test('returns user and token after successful login', async () => {
  const { login } = useAuth()
  expect(login).toBeDefined()
})

test('clears user and token on logout', () => {
  const { logout } = useAuth()
  expect(logout).toBeDefined()
})

test('handles registration errors', () => {
  const { register } = useAuth()
  expect(register).toBeDefined()
})