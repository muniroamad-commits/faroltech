import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { payInvoice } from '../lib/paysuite'

export default function Invoices() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [payingId, setPayingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'invoices'), where('clientId', '==', user.uid), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => setInvoices(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [user])

  async function handlePay(invoiceId, method) {
    setError(''); setPayingId(invoiceId)
    try {
      const result = await payInvoice(invoiceId, method)
      if (result.checkoutUrl) window.location.href = result.checkoutUrl
      else alert('Pedido de pagamento enviado. Confirme no seu telemóvel.')
    } catch (err) {
      setError('Não foi possível iniciar o pagamento. Tente novamente ou contacte o suporte.')
    } finally {
      setPayingId(null)
    }
  }

  return (
    <div>
      <h1>Facturas</h1>
      {error && <div className="form-error">{error}</div>}
      <div className="panel">
        {invoices.length === 0 && <p className="empty">Ainda não tem facturas.</p>}
        {invoices.map((inv) => (
          <div className="invoice-item" key={inv.id}>
            <div className="invoice-main"><strong>{inv.description}</strong><span>{inv.amount} MT</span></div>
            <div className="invoice-footer">
              <span className={`badge ${inv.status === 'paid' ? 'closed' : 'open'}`}>{inv.status === 'paid' ? 'Paga' : 'Por pagar'}</span>
              {inv.status !== 'paid' ? (
                <div className="pay-buttons">
                  <button disabled={payingId === inv.id} onClick={() => handlePay(inv.id, 'mpesa')}>M-Pesa</button>
                  <button disabled={payingId === inv.id} onClick={() => handlePay(inv.id, 'emola')}>e-Mola</button>
                  <button disabled={payingId === inv.id} onClick={() => handlePay(inv.id, 'card')}>Cartão</button>
                </div>
              ) : (
                <Link className="receipt-btn" to={`/portal/recibo/${inv.id}`}>Ver recibo</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
