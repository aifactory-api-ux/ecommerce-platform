import { render } from '@testing-library/react'
import React from 'react'
import axios from 'axios'

jest.mock('axios')

import { register, login, refreshToken, getProfile } from '../src/api/auth'

test('registers user with valid data', async () => {
  axios.post.mockResolvedValue({ data: { id: 1, email: 'test@example.com', name: 'Test', role: 'customer' } })
  const result = await register({ email: 'test@example.com', password: 'StrongPass123', name: 'Test User' })
  expect(result.email).toBe('test@example.com')
})

test('fails registration with missing email', async () => {
  axios.post.mockRejectedValue({ response: { status: 422 } })
  await expect(register({ password: 'StrongPass123', name: 'Test User' })).rejects.toBeDefined()
})

test('login returns tokens for valid credentials', async () => {
  axios.post.mockResolvedValue({ data: { access_token: 'abc', refresh_token: 'def', token_type: 'bearer' } })
  const result = await login({ email: 'test@example.com', password: 'StrongPass123' })
  expect(result.access_token).toBe('abc')
})

test('login fails with invalid password', async () => {
  axios.post.mockRejectedValue({ response: { status: 401 } })
  await expect(login({ email: 'test@example.com', password: 'wrong' })).rejects.toBeDefined()
})

test('refresh returns new access token', async () => {
  axios.post.mockResolvedValue({ data: { access_token: 'newtoken', token_type: 'bearer' } })
  const result = await refreshToken('valid_refresh_token')
  expect(result.access_token).toBe('newtoken')
})

test('profile returns user info when authenticated', async () => {
  axios.get.mockResolvedValue({ data: { id: 1, email: 'test@example.com', name: 'Test', role: 'customer' } })
  const result = await getProfile('valid_access_token')
  expect(result.email).toBe('test@example.com')
})

test('profile fails without authentication', async () => {
  axios.get.mockRejectedValue({ response: { status: 401 } })
  await expect(getProfile('')).rejects.toBeDefined()
})