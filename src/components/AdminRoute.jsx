import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="page-loading">A carregar…</div>
  if (!user) return <Navigate to="/entrar" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
