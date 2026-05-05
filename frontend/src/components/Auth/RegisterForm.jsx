import React, { useState } from 'react'

function RegisterForm({ onSubmit, loading, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ email, password, name })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <button type="submit" disabled={loading}>Register</button>
    </form>
  )
}

export default RegisterForm