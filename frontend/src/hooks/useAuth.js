import { useState } from 'react'
import { register, login, refreshToken, getProfile } from '../api/auth'
import { getStorage, setStorage, removeStorage } from '../utils/storage'

function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const token = getStorage('access_token')

  async function authLogin(data) {
    setLoading(true)
    setError(null)
    try {
      const result = await login(data)
      setStorage('access_token', result.access_token)
      setStorage('refresh_token', result.refresh_token)
      const profile = await getProfile(result.access_token)
      setUser(profile)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function authRegister(data) {
    setLoading(true)
    setError(null)
    try {
      await register(data)
      await authLogin({ email: data.email, password: data.password })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    removeStorage('access_token')
    removeStorage('refresh_token')
    setUser(null)
  }

  async function refresh() {
    const refresh_token = getStorage('refresh_token')
    if (!refresh_token) return
    try {
      const result = await refreshToken(refresh_token)
      setStorage('access_token', result.access_token)
    } catch (e) {
      logout()
    }
  }

  return { user, loading, error, login: authLogin, register: authRegister, logout, refresh }
}

export default useAuth