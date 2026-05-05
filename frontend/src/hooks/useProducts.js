import { useState, useEffect } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/product'

function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function loadProducts() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts()
      setProducts(data.products || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function addProduct(data, token) {
    setLoading(true)
    try {
      await createProduct(data, token)
      await loadProducts()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function editProduct(id, data, token) {
    setLoading(true)
    try {
      await updateProduct(id, data, token)
      await loadProducts()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function removeProduct(id, token) {
    setLoading(true)
    try {
      await deleteProduct(id, token)
      await loadProducts()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, fetchProducts: loadProducts, createProduct: addProduct, updateProduct: editProduct, deleteProduct: removeProduct }
}

export default useProducts