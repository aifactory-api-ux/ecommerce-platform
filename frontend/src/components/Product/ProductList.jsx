import React from 'react'

function ProductList({ products, onEdit, onDelete, loading }) {
  if (loading) return <p>Loading...</p>
  if (!products.length) return <p>No products found.</p>

  return (
    <div>
      <h2>Products</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem'}}>
        {products.map(product => (
          <div key={product.id} style={{border: '1px solid #ccc', padding: '1rem'}}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={() => onEdit(product.id)}>Edit</button>
            <button onClick={() => onDelete(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList