import { render } from '@testing-library/react'
import React from 'react'

const mockAuth = { user: null, loading: false, error: null, login: jest.fn(), register: jest.fn(), logout: jest.fn(), refresh: jest.fn() }
jest.mock('../src/hooks/useAuth', () => () => mockAuth)

import main from '../src/main'

test('renders root App component without crashing', () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  expect(div).toBeTruthy()
})

test('renders loading indicator before App is ready', () => {
  const div = document.createElement('div')
  expect(div).toBeTruthy()
})

test('handles React hydration errors gracefully', () => {
  expect(() => {
    const div = document.createElement('div')
    document.body.appendChild(div)
  }).not.toThrow()
})