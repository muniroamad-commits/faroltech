import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function AdminTickets() {
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [])

  async function setStatus(id, status) {
    await updateDoc(doc(db, 'tickets', id), { status })
  }

  return (
    <div>
      <h1>Todos os tickets</h1>
      <div className="panel">
        {tickets.length === 0 && <p className="empty">Sem tickets ainda.</p>}
        {tickets.map((t) => (
          <div className="admin-ticket-item" key={t.id}>
            <div className="ticket-item-head">
              <strong>{t.subject}</strong>
              <select value={t.status} onChange={(e) => setStatus(t.id, e.target.value)}>
                <option value="open">Aberto</option>
                <option value="progress">Em curso</option>
                <option value="closed">Resolvido</option>
              </select>
            </div>
            <p>{t.message}</p>
            <div className="admin-client">{t.clientName} · {t.clientEmail} · Prioridade: {t.priority}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
