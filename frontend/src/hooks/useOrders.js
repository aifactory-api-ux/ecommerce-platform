import { useState, useCallback } from 'react';
import { getOrders, getOrder, createOrder, updateOrderStatus } from '../api/order';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    setSelectedOrder(null);
    try {
      const data = await getOrder(orderId);
      setSelectedOrder(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Order not found');
      } else {
        setError(err.response?.data?.detail || 'Failed to fetch order');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrderFn = useCallback(async (orderData) => {
    if (!orderData.items || orderData.items.length === 0) {
      setError('Validation error: items is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newOrder = await createOrder(orderData);
      setOrders((prev) => [...prev, newOrder]);
      return newOrder;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatusFn = useCallback(async (orderId, status) => {
    const validStatuses = ['pending', 'paid', 'shipped', 'cancelled'];
    if (!validStatuses.includes(status)) {
      setError('Validation error: status must be one of pending, paid, shipped, cancelled');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      return updatedOrder;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update order status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedOrder]);

  return {
    orders,
    selectedOrder,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder: createOrderFn,
    updateOrderStatus: updateOrderStatusFn
  };
}