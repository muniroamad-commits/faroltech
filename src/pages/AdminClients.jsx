import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function AdminClients() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [])

  async function toggleAdmin(id, currentRole) {
    const newRole = currentRole === 'admin' ? 'client' : 'admin'
    if (!confirm(newRole === 'admin' ? 'Tornar este utilizador administrador?' : 'Remover privilégios de administrador?')) return
    await updateDoc(doc(db, 'clients', id), { role: newRole })
  }

  return (
    <div>
      <h1>Clientes registados</h1>
      <div className="panel">
        {clients.length === 0 && <p className="empty">Sem clientes registados ainda.</p>}
        {clients.map((c) => (
          <div className="row" key={c.id}>
            <span>{c.name} — {c.email} <span className="admin-client">(UID: {c.id})</span></span>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {c.role === 'admin' && <span className="badge closed">admin</span>}
              <button onClick={() => toggleAdmin(c.id, c.role)}>{c.role === 'admin' ? 'Remover admin' : 'Tornar admin'}</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
