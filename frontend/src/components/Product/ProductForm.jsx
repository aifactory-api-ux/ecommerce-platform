import React, { useState } from 'react'

function ProductForm({ onSubmit, loading, initialData }) {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [price, setPrice] = useState(initialData?.price || '')
  const [stock, setStock] = useState(initialData?.stock || '')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ name, description, price: parseFloat(price), stock: parseInt(stock) })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Product' : 'Create Product'}</h2>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
      <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required />
      <button type="submit" disabled={loading}>{initialData ? 'Update' : 'Create'}</button>
    </form>
  )
}

export default ProductForm