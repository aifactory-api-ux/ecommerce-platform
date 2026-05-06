import React from 'react';

function ProductDetail({ product }) {
  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <p className="description">{product.description}</p>
      <div className="product-meta">
        <span className="price">${product.price.toFixed(2)}</span>
        <span className="stock">Stock: {product.stock}</span>
      </div>
    </div>
  );
}

export default ProductDetail;