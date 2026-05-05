import axios from 'axios'

const API_BASE = import.meta.env.VITE_BACKEND_AUTH_URL || 'http://localhost:23001'

export async function register(data) {
  const response = await axios.post(`${API_BASE}/auth/register`, data)
  return response.data
}

export async function login(data) {
  const response = await axios.post(`${API_BASE}/auth/login`, data)
  return response.data
}

export async function refreshToken(refresh_token) {
  const response = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token })
  return response.data
}

export async function getProfile(token) {
  const response = await axios.get(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}