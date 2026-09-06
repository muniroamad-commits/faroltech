export default function Contactos() {
  function handleSubmit(e) {
    e.preventDefault()
    const name = e.target.name.value
    const email = e.target.email.value
    const message = e.target.message.value
    const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:contacto@faroltechmz.com?subject=${encodeURIComponent('Contacto pelo site — ' + name)}&body=${body}`
  }

  return (
    <div>
      <div className="page-header">
        <div className="wrap"><div className="kicker">Empresa</div><h1>Contactos</h1><p>Fale connosco — respondemos o mais rápido possível.</p></div>
      </div>
      <section className="page-section">
        <div className="wrap contact-grid">
          <div className="contact-info">
            <div className="info-row"><div><strong>Morada</strong><span>Pemba, Cabo Delgado, Moçambique</span></div></div>
            <div className="info-row"><div><strong>Email</strong><span>contacto@faroltechmz.com</span></div></div>
            <div className="info-row"><div><strong>Telefone</strong><span>+258 84 000 0000</span></div></div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>Nome</label>
            <input name="name" required placeholder="O seu nome" />
            <label>Email</label>
            <input name="email" type="email" required placeholder="voce@empresa.co.mz" />
            <label>Mensagem</label>
            <textarea name="message" rows={5} required placeholder="Como podemos ajudar?" />
            <button type="submit" className="btn-primary" style={{ marginTop: 16, width: '100%' }}>Enviar mensagem</button>
          </form>
        </div>
      </section>
    </div>
  )
}
