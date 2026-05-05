import React from 'react'

function OrderForm({ onSubmit, loading }) {
  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ items: [] })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Place Order</h2>
      <button type="submit" disabled={loading}>Place Order</button>
    </form>
  )
}

export default OrderForm