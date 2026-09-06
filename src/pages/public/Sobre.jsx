export default function Sobre() {
  return (
    <div>
      <div className="page-header">
        <div className="wrap"><div className="kicker">Empresa</div><h1>Sobre nós</h1><p>Missão, visão, valores e o que nos orienta todos os dias.</p></div>
      </div>
      <section className="page-section">
        <div className="wrap">
          <div className="mvv-grid">
            <div className="mvv-card">
              <div className="tag">MISSÃO</div>
              <p>Tornar a tecnologia acessível a negócios e organizações moçambicanas, entregando sites, aplicativos e identidades visuais com qualidade e proximidade.</p>
            </div>
            <div className="mvv-card">
              <div className="tag">VISÃO</div>
              <p>Ser reconhecida como a agência digital de referência para pequenas e médias empresas, guiando-as com confiança para o mundo digital.</p>
            </div>
          </div>

          <div className="values-grid">
            <div className="value-chip"><div className="v-title">Proximidade</div><p>Atendimento directo, em português, sem intermediários.</p></div>
            <div className="value-chip"><div className="v-title">Qualidade</div><p>Cada projecto entregue com o mesmo cuidado, do maior ao mais pequeno.</p></div>
            <div className="value-chip"><div className="v-title">Transparência</div><p>Prazos e preços claros, sem surpresas a meio do projecto.</p></div>
            <div className="value-chip"><div className="v-title">Compromisso</div><p>Acompanhamos o cliente depois do lançamento, não só até à entrega.</p></div>
          </div>

          <div className="section-head" style={{ marginTop: 48, marginBottom: 0 }}>
            <div className="kicker">Objectivos</div>
            <h2 style={{ fontSize: '1.4rem' }}>O que nos orienta todos os dias</h2>
          </div>
          <div className="objectives-list">
            <div className="objective-item"><span className="num">01</span><p>Entregar cada projecto dentro do prazo e do orçamento acordado.</p></div>
            <div className="objective-item"><span className="num">02</span><p>Manter o cliente informado em cada etapa, sem precisar de perguntar.</p></div>
            <div className="objective-item"><span className="num">03</span><p>Construir relações de longo prazo — não apenas projectos pontuais.</p></div>
            <div className="objective-item"><span className="num">04</span><p>Investir continuamente em novas competências e boas práticas digitais.</p></div>
          </div>
        </div>
      </section>
    </div>
  )
}
