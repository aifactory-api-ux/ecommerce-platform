import axios from 'axios';
import { ORDER_URL } from '../types/order';

const api = axios.create({
  baseURL: ORDER_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getOrders = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createOrder = async (data) => {
  const response = await api.post('/', data);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/${id}/status`, { status });
  return response.data;
};