import React from 'react';

function OrderDetail({ order }) {
  if (!order) {
    return <div className="loading">Loading order details...</div>;
  }

  return (
    <div className="order-detail">
      <h2>Order #{order.id}</h2>
      <div className="order-status">
        <strong>Status:</strong> {order.status}
      </div>
      <div className="order-total">
        <strong>Total:</strong> ${order.total.toFixed(2)}
      </div>
      <div className="order-items-list">
        <h3>Items</h3>
        {order.items && order.items.length > 0 ? (
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items in this order</p>
        )}
      </div>
    </div>
  );
}

export default OrderDetail;