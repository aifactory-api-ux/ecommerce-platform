import { useState, useEffect, useCallback } from 'react';
import { register, login, refreshToken, getMe } from '../api/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (err) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginFn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      await checkAuth();
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerFn = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await register(data);
      await loginFn(data.email, data.password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const refreshTokenFn = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) return;
    try {
      const data = await refreshToken({ refresh_token });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
    } catch (err) {
      logout();
    }
  };

  return { user, loading, error, login: loginFn, register: registerFn, logout, refreshToken: refreshTokenFn, isAuthenticated };
}