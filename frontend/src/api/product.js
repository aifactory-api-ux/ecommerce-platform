import axios from 'axios';
import { PRODUCT_URL } from '../types/product';

const api = axios.create({
  baseURL: PRODUCT_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post('/', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};