import axios from 'axios'

const API_BASE = import.meta.env.VITE_BACKEND_PRODUCT_URL || 'http://localhost:23002'

export async function fetchProducts() {
  const response = await axios.get(`${API_BASE}/products`)
  return response.data
}

export async function fetchProduct(id) {
  const response = await axios.get(`${API_BASE}/products/${id}`)
  return response.data
}

export async function createProduct(data, token) {
  const response = await axios.post(`${API_BASE}/products`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function updateProduct(id, data, token) {
  const response = await axios.put(`${API_BASE}/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function deleteProduct(id, token) {
  const response = await axios.delete(`${API_BASE}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}