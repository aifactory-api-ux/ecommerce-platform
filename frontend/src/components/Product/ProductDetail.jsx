import React from 'react'

function ProductDetail({ product, onAddToCart }) {
  if (!product) return <p>Loading...</p>

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <p>In stock: {product.stock}</p>
      <button onClick={() => onAddToCart(product.id)} disabled={product.stock === 0}>
        Add to Cart
      </button>
    </div>
  )
}

export default ProductDetail