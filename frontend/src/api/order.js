import axios from 'axios'

const API_BASE = import.meta.env.VITE_BACKEND_ORDER_URL || 'http://localhost:23003'

export async function fetchOrders(token) {
  const response = await axios.get(`${API_BASE}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function fetchOrder(id, token) {
  const response = await axios.get(`${API_BASE}/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function createOrder(data, token) {
  const response = await axios.post(`${API_BASE}/orders`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}