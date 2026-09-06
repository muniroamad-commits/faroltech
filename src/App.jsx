import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import PublicLayout from './components/PublicLayout'
import Nav from './components/Nav'

import Home from './pages/public/Home'
import Sobre from './pages/public/Sobre'
import Clientes from './pages/public/Clientes'
import Contactos from './pages/public/Contactos'
import ServiceDetail from './pages/public/ServiceDetail'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import Invoices from './pages/Invoices'
import Receipt from './pages/Receipt'
import AdminTickets from './pages/AdminTickets'
import AdminInvoices from './pages/AdminInvoices'
import AdminClients from './pages/AdminClients'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Site público — o que fica no domínio principal */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/servicos/:slug" element={<ServiceDetail />} />
        </Route>

        <Route path="/entrar" element={<Login />} />
        <Route path="/registar" element={<Signup />} />

        {/* Portal do cliente e administração — exige sessão iniciada */}
        <Route path="/portal" element={<ProtectedRoute><Nav /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="facturas" element={<Invoices />} />
          <Route path="recibo/:id" element={<Receipt />} />
          <Route path="admin/tickets" element={<AdminRoute><AdminTickets /></AdminRoute>} />
          <Route path="admin/facturas" element={<AdminRoute><AdminInvoices /></AdminRoute>} />
          <Route path="admin/clientes" element={<AdminRoute><AdminClients /></AdminRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
