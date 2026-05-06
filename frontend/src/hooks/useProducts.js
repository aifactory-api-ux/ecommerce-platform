import { useState, useCallback } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/product';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProductFn = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await createProduct(productData);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProductFn = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await updateProduct(id, productData);
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
      return updatedProduct;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProductFn = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, fetchProducts, createProduct: createProductFn, updateProduct: updateProductFn, deleteProduct: deleteProductFn };
}