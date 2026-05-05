import { getStorage, setStorage, removeStorage } from '../src/utils/storage'

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('sets and gets value from localStorage', () => {
    setStorage('access_token', 'abc123')
    expect(getStorage('access_token')).toBe('abc123')
  })

  test('removes value from localStorage', () => {
    setStorage('refresh_token', 'def456')
    removeStorage('refresh_token')
    expect(getStorage('refresh_token')).toBeNull()
  })

  test('returns null for missing key', () => {
    expect(getStorage('nonexistent')).toBeNull()
  })
})