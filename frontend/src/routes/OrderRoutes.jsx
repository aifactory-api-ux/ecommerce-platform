import React from 'react'
import { Routes, Route } from 'react-router-dom'
import OrderList from '../components/Order/OrderList'
import OrderDetail from '../components/Order/OrderDetail'

function OrderRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OrderList />} />
      <Route path="/:id" element={<OrderDetail />} />
    </Routes>
  )
}

export default OrderRoutes