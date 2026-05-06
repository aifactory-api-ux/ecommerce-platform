import React from 'react';

function OrderList({ orders, onView, loading }) {
  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="empty-state">No orders available</div>;
  }

  return (
    <div className="order-list">
      {orders.map((order) => (
        <div key={order.id} className="order-card" onClick={() => onView(order.id)}>
          <div className="order-header">
            <span className="order-id">Order #{order.id}</span>
            <span className={`order-status status-${order.status}`}>{order.status}</span>
          </div>
          <div className="order-info">
            <span className="order-total">Total: ${order.total.toFixed(2)}</span>
            <span className="order-items">{order.items.length} items</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderList;