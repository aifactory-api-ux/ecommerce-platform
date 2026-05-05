import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from '../components/Auth/LoginForm'
import RegisterForm from '../components/Auth/RegisterForm'
import useAuth from '../hooks/useAuth'

function AuthRoutes() {
  const { user, login, register } = useAuth()

  if (user) return <Navigate to="/" replace />

  return (
    <Routes>
      <Route path="/login" element={<LoginForm onSubmit={login} />} />
      <Route path="/register" element={<RegisterForm onSubmit={register} />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}

export default AuthRoutes