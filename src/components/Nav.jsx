import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Nav() {
  const { user, profile, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/entrar')
  }

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <div className="brand">
          <Link to="/"><img src="/logo.png" alt="Farol Tech" style={{ height: 34 }} /></Link>
        </div>
        <nav>
          <NavLink to="/portal" end>Visão geral</NavLink>
          <NavLink to="/portal/tickets">Tickets</NavLink>
          <NavLink to="/portal/facturas">Facturas</NavLink>
          {isAdmin && (
            <>
              <div className="nav-divider">Administração</div>
              <NavLink to="/portal/admin/tickets">Todos os tickets</NavLink>
              <NavLink to="/portal/admin/facturas">Todas as facturas</NavLink>
              <NavLink to="/portal/admin/clientes">Clientes</NavLink>
            </>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="who">{profile?.name || user?.email}{isAdmin && <span className="admin-tag">admin</span>}</div>
          <button onClick={handleLogout}>Terminar sessão</button>
        </div>
      </aside>
      <main className="portal-content">
        <Outlet />
      </main>
    </div>
  )
}
