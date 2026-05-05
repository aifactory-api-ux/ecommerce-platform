import React from 'react'

function OrderList({ orders, loading }) {
  if (loading) return <p>Loading...</p>
  if (!orders.length) return <p>No orders found.</p>

  return (
    <div>
      <h2>Order History</h2>
      {orders.map(order => (
        <div key={order.id} style={{border: '1px solid #ccc', padding: '1rem', margin: '1rem 0'}}>
          <p>Order #{order.id}</p>
          <p>Total: ${order.total}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  )
}

export default OrderList