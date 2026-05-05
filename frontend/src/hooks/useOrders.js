import { useState } from 'react'
import { fetchOrders, fetchOrder, createOrder } from '../api/order'

function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function loadOrders(token) {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOrders(token)
      setOrders(data.orders || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadOrder(id, token) {
    setLoading(true)
    setError(null)
    try {
      return await fetchOrder(id, token)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function addOrder(data, token) {
    setLoading(true)
    try {
      await createOrder(data, token)
      await loadOrders(token)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { orders, loading, error, fetchOrders: loadOrders, fetchOrder: loadOrder, createOrder: addOrder }
}

export default useOrders