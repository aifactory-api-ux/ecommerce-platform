import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/Product/ProductForm';
import { getProduct, createProduct, updateProduct } from '../api/product';
import { useAuth } from '../hooks/useAuth';

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true);
      getProduct(id)
        .then((data) => {
          setInitialData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Product not found');
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      if (id && id !== 'new') {
        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save product');
    }
  };

  if (user?.role !== 'admin') {
    return <div className="error-message">Access denied</div>;
  }

  return (
    <div className="product-edit-page">
      <h1>{id && id !== 'new' ? 'Edit Product' : 'Create Product'}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductForm
          initial={initialData}
          onSubmit={handleSubmit}
          loading={false}
        />
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ProductEdit;