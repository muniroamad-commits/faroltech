import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([])
  const [clientId, setClientId] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => setInvoices(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!clientId.trim() || !clientEmail.trim() || !description.trim() || !amount) return
    await addDoc(collection(db, 'invoices'), {
      clientId: clientId.trim(), clientEmail: clientEmail.trim(),
      description, amount: Number(amount), status: 'pending', createdAt: serverTimestamp(),
    })
    setClientId(''); setClientEmail(''); setDescription(''); setAmount('')
  }

  async function markPaid(id) {
    const method = prompt('Como foi pago? (ex: M-Pesa, e-Mola, Transferência)', 'M-Pesa') || 'Confirmado manualmente'
    await updateDoc(doc(db, 'invoices', id), { status: 'paid', method, paidAt: new Date() })
  }

  return (
    <div>
      <h1>Todas as facturas</h1>
      <form className="invoice-create-form" onSubmit={handleCreate}>
        <label>UID do cliente (Firebase Auth)</label>
        <input required value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Ver na aba Clientes ou na consola Firebase" />
        <label>Email do cliente</label>
        <input required value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="cliente@empresa.co.mz" />
        <label>Descrição</label>
        <input required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Site institucional — sinal" />
        <label>Valor (MT)</label>
        <input required type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="15000" />
        <button type="submit" className="btn-primary" style={{ marginTop: 14 }}>Criar factura</button>
      </form>

      <div className="panel">
        {invoices.length === 0 && <p className="empty">Sem facturas ainda.</p>}
        {invoices.map((i) => (
          <div className="invoice-item" key={i.id}>
            <div className="invoice-main"><strong>{i.description}</strong><span>{i.amount} MT</span></div>
            <div className="invoice-footer">
              <span className="admin-client">{i.clientEmail}</span>
              <span className={`badge ${i.status === 'paid' ? 'closed' : 'open'}`}>{i.status === 'paid' ? `Paga · ${i.method || ''}` : 'Por pagar'}</span>
              {i.status !== 'paid' && <button onClick={() => markPaid(i.id)}>Marcar como paga</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
