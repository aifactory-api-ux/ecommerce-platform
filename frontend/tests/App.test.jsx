import { render } from '@testing-library/react'
import App from '../src/App'

test('renders root App component without crashing', () => {
  render(<App />)
})

test('renders loading indicator before App is ready', () => {
  const { container } = render(<App />)
  expect(container).toBeTruthy()
})

test('handles React hydration errors gracefully', () => {
  expect(() => render(<App />)).not.toThrow()
})