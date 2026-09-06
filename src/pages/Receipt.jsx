import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function Receipt() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [invoice, setInvoice] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'invoices', id))
      if (!snap.exists() || snap.data().clientId !== user.uid) { setNotFound(true); return }
      setInvoice(snap.data())
    }
    load()
  }, [id, user])

  if (notFound) return <div className="receipt-page"><p>Recibo não encontrado.</p><Link to="/portal/facturas">Voltar às facturas</Link></div>
  if (!invoice) return <div className="page-loading">A carregar…</div>

  return (
    <div className="receipt-page">
      <div className="receipt-card">
        <img src="/logo.png" alt="Farol Tech" style={{ height: 40, marginBottom: 16 }} />
        <div className="receipt-muted">Comprovativo de pagamento — não é factura fiscal certificada</div>
        <table>
          <tbody>
            <tr><td>Recibo</td><td>{id}</td></tr>
            <tr><td>Cliente</td><td>{profile?.name || user.email}</td></tr>
            <tr><td>Descrição</td><td>{invoice.description}</td></tr>
            <tr><td>Valor</td><td>{invoice.amount} MT</td></tr>
            <tr><td>Método</td><td>{invoice.method || '—'}</td></tr>
            <tr><td>Data de pagamento</td><td>{invoice.paidAt?.toDate ? invoice.paidAt.toDate().toLocaleDateString('pt-PT') : '—'}</td></tr>
          </tbody>
        </table>
        <div className="paid-stamp">PAGO</div>
        <button className="btn-primary no-print" onClick={() => window.print()}>Imprimir / Guardar PDF</button>
        <Link className="no-print back-link" to="/portal/facturas">← Voltar às facturas</Link>
      </div>
    </div>
  )
}
