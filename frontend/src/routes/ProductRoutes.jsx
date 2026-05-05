import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProductList from '../components/Product/ProductList'
import ProductDetail from '../components/Product/ProductDetail'

function ProductRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/:id" element={<ProductDetail />} />
    </Routes>
  )
}

export default ProductRoutes