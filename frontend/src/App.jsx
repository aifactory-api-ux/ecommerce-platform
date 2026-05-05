import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthRoutes from './routes/AuthRoutes'
import ProductRoutes from './routes/ProductRoutes'
import OrderRoutes from './routes/OrderRoutes'
import useAuth from './hooks/useAuth'

function App() {
  const { user } = useAuth()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/products/*" element={<ProductRoutes />} />
        <Route path="/orders/*" element={<OrderRoutes />} />
        <Route path="/" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App