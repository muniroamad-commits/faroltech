import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [tickets, setTickets] = useState([])
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    if (!user) return
    const tQ = query(collection(db, 'tickets'), where('clientId', '==', user.uid), orderBy('createdAt', 'desc'), limit(3))
    const iQ = query(collection(db, 'invoices'), where('clientId', '==', user.uid), orderBy('createdAt', 'desc'), limit(3))
    const u1 = onSnapshot(tQ, (s) => setTickets(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
    const u2 = onSnapshot(iQ, (s) => setInvoices(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
    return () => { u1(); u2() }
  }, [user])

  const openInvoices = invoices.filter((i) => i.status === 'pending').length
  const openTickets = tickets.filter((t) => t.status !== 'closed').length

  return (
    <div>
      <h1>Bem-vindo(a), {profile?.name || user?.email}</h1>
      <div className="stat-cards">
        <div className="stat-card"><div className="stat-num">{openTickets}</div><div className="stat-label">Tickets abertos</div></div>
        <div className="stat-card"><div className="stat-num">{openInvoices}</div><div className="stat-label">Facturas por pagar</div></div>
      </div>

      <div className="panel">
        <div className="panel-head"><h2>Tickets recentes</h2><Link to="/portal/tickets">Ver todos</Link></div>
        {tickets.length === 0 && <p className="empty">Ainda não tem tickets. <Link to="/portal/tickets">Abrir o primeiro</Link>.</p>}
        {tickets.map((t) => (
          <div className="row" key={t.id}><span>{t.subject}</span><span className={`badge ${t.status}`}>{statusLabel(t.status)}</span></div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head"><h2>Facturas recentes</h2><Link to="/portal/facturas">Ver todas</Link></div>
        {invoices.length === 0 && <p className="empty">Ainda sem facturas.</p>}
        {invoices.map((i) => (
          <div className="row" key={i.id}><span>{i.description} — {i.amount} MT</span><span className={`badge ${i.status === 'paid' ? 'closed' : 'open'}`}>{i.status === 'paid' ? 'Paga' : 'Por pagar'}</span></div>
        ))}
      </div>
    </div>
  )
}

function statusLabel(status) {
  if (status === 'open') return 'Aberto'
  if (status === 'progress') return 'Em curso'
  return 'Resolvido'
}
