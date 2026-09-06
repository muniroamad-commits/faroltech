import { useParams, Link, Navigate } from 'react-router-dom'

const DETAILS = {
  sites: {
    title: 'Criação de sites',
    lead: 'Sites institucionais, lojas online e landing pages — rápidos, responsivos e fáceis de atualizar, feitos para representar bem o seu negócio desde o primeiro acesso.',
    bullets: [
      'Design responsivo, adaptado a telemóvel e computador',
      'Estrutura de páginas pensada para o seu tipo de negócio',
      'Formulários de contacto e integração com WhatsApp',
      'Optimização básica para motores de busca (SEO)',
      'Formação rápida para poder actualizar conteúdos sozinho(a)',
    ],
    price: 'Desde 35.000 MT', note: 'Prazo médio de entrega: 2 a 3 semanas, consoante a complexidade.',
  },
  apps: {
    title: 'Aplicativos móveis e web',
    lead: 'Aplicativos feitos à medida da sua operação — para gestão interna, vendas, ou atendimento directo ao cliente.',
    bullets: [
      'Levantamento de requisitos e desenho de fluxo de utilização',
      'Desenvolvimento para web e/ou telemóvel',
      'Ligação a bases de dados e sistemas já existentes, quando aplicável',
      'Testes antes do lançamento',
      'Acompanhamento após o lançamento',
    ],
    price: 'Sob consulta', note: 'O valor depende do âmbito — cada aplicativo é orçado individualmente.',
  },
  design: {
    title: 'Web design e identidade visual',
    lead: 'Uma marca coerente, do papel à tela — para que o seu negócio seja reconhecido em qualquer lugar onde apareça.',
    bullets: [
      'Logótipo e variações (cor, monocromático, ícone)',
      'Paleta de cores e tipografia da marca',
      'Aplicação da identidade no site e materiais digitais',
      'Guia rápido de uso da marca',
    ],
    price: 'Desde 20.000 MT', note: 'Inclui 2 propostas iniciais e 2 rondas de ajustes.',
  },
  suporte: {
    title: 'Manutenção e suporte',
    lead: 'Acompanhamento contínuo depois do site ou aplicativo estar no ar — para que nunca fique sozinho(a) a resolver um problema técnico.',
    bullets: [
      'Actualizações de conteúdo e pequenos ajustes',
      'Resolução de problemas técnicos via ticket de suporte',
      'Monitorização básica de funcionamento',
      'Aconselhamento sobre alojamento e domínio, quando necessário',
    ],
    price: 'Incluído nos primeiros meses', note: 'Depois desse período, funciona por pacote de horas ou pedido avulso.',
  },
  consultoria: {
    title: 'Consultoria digital',
    lead: 'Estratégia digital para PMEs, ONGs e instituições que querem crescer online, mas não sabem por onde começar.',
    bullets: [
      'Diagnóstico da presença digital actual',
      'Recomendações práticas e priorizadas',
      'Acompanhamento na implementação, se desejado',
    ],
    price: 'Sob consulta', note: 'Sessão inicial de diagnóstico incluída no orçamento.',
  },
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const data = DETAILS[slug]
  if (!data) return <Navigate to="/" replace />

  return (
    <div>
      <div className="page-header"><div className="wrap"><div className="kicker">Serviços</div><h1>{data.title}</h1></div></div>
      <section className="page-section">
        <div className="wrap service-detail">
          <div>
            <p className="lead">{data.lead}</p>
            <ul>{data.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
          <div className="service-side">
            <div className="price-tag">{data.price}</div>
            <p>{data.note}</p>
            <Link className="btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center' }} to="/entrar">Pedir orçamento</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
