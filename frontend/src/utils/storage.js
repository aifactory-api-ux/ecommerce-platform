const STORAGE_PREFIX = 'ecommerce_'

export function getStorage(key) {
  try {
    return localStorage.getItem(STORAGE_PREFIX + key)
  } catch {
    return null
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, value)
  } catch {
    // ignore
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch {
    // ignore
  }
}