import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function Invoices() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'invoices'), where('clientId', '==', user.uid), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => setInvoices(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [user])

  return (
    <div>
      <h1>Facturas</h1>
      <div className="panel">
        {invoices.length === 0 && <p className="empty">Ainda não tem facturas.</p>}
        {invoices.map((inv) => (
          <div className="invoice-item" key={inv.id}>
            <div className="invoice-main"><strong>{inv.description}</strong><span>{inv.amount} MT</span></div>
            <div className="invoice-footer">
              <span className={`badge ${inv.status === 'paid' ? 'closed' : 'open'}`}>{inv.status === 'paid' ? 'Paga' : 'Por pagar'}</span>
              {inv.status === 'paid' ? (
                <Link className="receipt-btn" to={`/portal/recibo/${inv.id}`}>Ver recibo</Link>
              ) : (
                <span className="pay-note">Pague por M-Pesa, e-Mola ou transferência e envie o comprovativo por email ou WhatsApp — confirmamos aqui em poucas horas.</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
