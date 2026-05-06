import axios from 'axios';
import { AUTH_URL } from '../types/auth';

const api = axios.create({
  baseURL: AUTH_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (data) => {
  const response = await api.post('/register', data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post('/login', data);
  return response.data;
};

export const refreshToken = async (data) => {
  const response = await api.post('/refresh', data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/me');
  return response.data;
};