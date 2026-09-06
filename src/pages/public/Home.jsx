import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <header className="hero">
        <div className="wrap">
          <div className="eyebrow">Sites · Aplicativos · Identidade Visual</div>
          <h1>Da ideia à marca, do design ao lançamento.</h1>
        </div>
      </header>

      <section className="plans">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Pacotes de serviço</div>
            <h2>Escolha o pacote certo para o seu projecto</h2>
          </div>
          <div className="plan-grid">
            <div className="plan">
              <div className="plan-name">Site Essencial</div>
              <div className="plan-price">35.000 MT</div>
              <ul><li>Site institucional até 5 páginas</li><li>Configuração de emails corporativos</li><li>Design responsivo</li></ul>
              <Link className="plan-cta" to="/entrar">Pedir orçamento</Link>
            </div>
            <div className="plan featured">
              <div className="plan-name">Site + Identidade Visual</div>
              <div className="plan-price">50.000 MT</div>
              <ul><li>Logótipo e identidade visual</li><li>Site institucional ou loja online</li><li>Configuração de emails corporativos</li></ul>
              <Link className="plan-cta" to="/entrar">Pedir orçamento</Link>
            </div>
            <div className="plan">
              <div className="plan-name">Identidade Visual</div>
              <div className="plan-price">20.000 MT</div>
              <ul><li>Logótipo e variações</li><li>Paleta de cores e tipografia</li><li>Guia rápido de uso da marca</li></ul>
              <Link className="plan-cta" to="/entrar">Pedir orçamento</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Pronto para colocar o seu negócio online?</h2>
          <Link className="btn-primary" to="/registar">Criar conta gratuita</Link>
        </div>
      </section>
    </div>
  )
}
