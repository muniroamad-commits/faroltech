import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const MANAGER_EMAIL = import.meta.env.VITE_MANAGER_EMAIL
const emailConfigured = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY)

export default function Tickets() {
  const { user, profile } = useAuth()
  const [tickets, setTickets] = useState([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('normal')
  const [busy, setBusy] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'tickets'), where('clientId', '==', user.uid), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [user])

  async function handleCreate(e) {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return
    setBusy(true)
    setNote('')
    try {
      await addDoc(collection(db, 'tickets'), {
        clientId: user.uid,
        clientEmail: user.email,
        clientName: profile?.name || user.email,
        subject, message, priority, status: 'open',
        createdAt: serverTimestamp(),
      })

      if (emailConfigured) {
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: MANAGER_EMAIL,
            client_name: profile?.name || user.email,
            client_email: user.email,
            subject, message, priority,
          }, EMAILJS_PUBLIC_KEY)
          setNote('Ticket enviado — a equipa de gestão foi notificada por email.')
        } catch {
          setNote('Ticket guardado, mas o envio de email falhou. Verifique a configuração do EmailJS.')
        }
      } else {
        setNote('Ticket guardado. Configure o EmailJS (.env) para notificar a equipa por email.')
      }

      setSubject(''); setMessage(''); setPriority('normal')
      setTimeout(() => { setShowForm(false); setNote('') }, 3500)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="panel-head">
        <h1>Tickets de suporte</h1>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cancelar' : 'Novo ticket'}</button>
      </div>

      {showForm && (
        <form className="ticket-form" onSubmit={handleCreate}>
          <label>Assunto</label>
          <input required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex: Ajuste no site" />
          <label>Descrição</label>
          <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Descreva o pedido com detalhe" />
          <label>Prioridade</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="baixa">Baixa</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta — serviço afectado</option>
          </select>
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'A enviar…' : 'Enviar ticket'}</button>
          {note && <div className="email-note">{note}</div>}
        </form>
      )}

      <div className="panel">
        {tickets.length === 0 && <p className="empty">Ainda não tem tickets abertos.</p>}
        {tickets.map((t) => (
          <div className="ticket-item" key={t.id}>
            <div className="ticket-item-head"><strong>{t.subject}</strong><span className={`badge ${t.status}`}>{statusLabel(t.status)}</span></div>
            <p>{t.message}</p>
            <div className="ticket-meta">Prioridade: {t.priority}</div>
          </div>
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
