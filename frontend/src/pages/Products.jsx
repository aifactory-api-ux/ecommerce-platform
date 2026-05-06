import React, { useEffect } from 'react';
import ProductList from '../components/Product/ProductList';
import { useProducts } from '../hooks/useProducts';

function Products() {
  const { products, fetchProducts, loading, error } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (id) => {
    window.location.href = `/products/edit/${id}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        fetchProducts();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <div className="products-page">
      <h1>Products</h1>
      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}

export default Products;