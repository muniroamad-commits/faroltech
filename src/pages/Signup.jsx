import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signup(name, email, password)
      navigate('/portal')
    } catch (err) {
      setError('Não foi possível criar a conta. Verifique os dados e tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <img src="/logo.png" alt="Farol Tech" className="auth-logo" />
        <h1>Criar conta de cliente</h1>
        <label>Nome</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="O seu nome ou empresa" />
        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.co.mz" />
        <label>Palavra-passe</label>
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
        {error && <div className="form-error">{error}</div>}
        <button type="submit" disabled={busy}>{busy ? 'A criar conta…' : 'Criar conta'}</button>
        <p className="auth-switch">Já tem conta? <Link to="/entrar">Entrar</Link></p>
      </form>
    </div>
  )
}
