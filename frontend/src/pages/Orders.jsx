import React, { useEffect } from 'react';
import OrderList from '../components/Order/OrderList';
import { useOrders } from '../hooks/useOrders';

function Orders() {
  const { orders, fetchOrders, loading, error } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleView = (id) => {
    window.location.href = `/orders/${id}`;
  };

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <OrderList orders={orders} onView={handleView} loading={loading} />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Orders;