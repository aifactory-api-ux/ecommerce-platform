import React from 'react'

function OrderDetail({ order }) {
  if (!order) return <p>Order not found</p>

  return (
    <div>
      <h2>Order #{order.id}</h2>
      <p>Total: ${order.total}</p>
      <p>Status: {order.status}</p>
      {order.items?.map((item, idx) => (
        <div key={idx}>
          <p>{item.name} - {item.quantity} x ${item.price}</p>
        </div>
      ))}
    </div>
  )
}

export default OrderDetail