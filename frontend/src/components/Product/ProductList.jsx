import React from 'react';

function ProductList({ products, onEdit, onDelete, loading }) {
  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="empty-state">No products available</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <div className="product-info">
            <span className="price">${product.price.toFixed(2)}</span>
            <span className="stock">Stock: {product.stock}</span>
          </div>
          <div className="product-actions">
            <button onClick={() => onEdit(product.id)}>Edit</button>
            <button onClick={() => onDelete(product.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;