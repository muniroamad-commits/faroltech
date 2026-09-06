import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SERVICES = [
  { slug: 'sites', name: 'Criação de sites', desc: 'Institucionais, lojas online, landing pages' },
  { slug: 'apps', name: 'Aplicativos móveis e web', desc: 'Apps sob medida para o seu negócio' },
  { slug: 'design', name: 'Web design e identidade visual', desc: 'Logótipo, paleta de cores e interface' },
  { slug: 'suporte', name: 'Manutenção e suporte', desc: 'Acompanhamento contínuo pós-lançamento' },
  { slug: 'consultoria', name: 'Consultoria digital', desc: 'Estratégia digital para PMEs e ONGs' },
]

export default function PublicLayout() {
  const { user } = useAuth()
  const [openMenu, setOpenMenu] = useState(null)
  const navRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null)
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  return (
    <div>
      <nav className="site-nav" ref={navRef}>
        <div className="nav-inner">
          <Link to="/" className="logo" onClick={() => setOpenMenu(null)}>
            <img src="/logo.png" alt="Farol Tech" />
          </Link>
          <div className="nav-links">
            <div className="nav-item">
              <button className="nav-top" onClick={() => setOpenMenu(openMenu === 'servicos' ? null : 'servicos')}>
                <span>Nossos Serviços</span><span className="caret">▾</span>
              </button>
              {openMenu === 'servicos' && (
                <div className="dropdown">
                  {SERVICES.map((s) => (
                    <Link key={s.slug} to={`/servicos/${s.slug}`} onClick={() => setOpenMenu(null)}>
                      {s.name}<span className="dd-desc">{s.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="nav-item">
              <button className="nav-top" onClick={() => setOpenMenu(openMenu === 'empresa' ? null : 'empresa')}>
                <span>Empresa</span><span className="caret">▾</span>
              </button>
              {openMenu === 'empresa' && (
                <div className="dropdown">
                  <Link to="/sobre" onClick={() => setOpenMenu(null)}>Sobre nós<span className="dd-desc">Missão, visão e valores</span></Link>
                  <Link to="/clientes" onClick={() => setOpenMenu(null)}>Nossos clientes</Link>
                  <Link to="/contactos" onClick={() => setOpenMenu(null)}>Contactos</Link>
                </div>
              )}
            </div>
            {user ? (
              <Link className="nav-cta" to="/portal">Ir para o portal</Link>
            ) : (
              <Link className="nav-cta" to="/entrar">Entrar</Link>
            )}
          </div>
        </div>
      </nav>

      <Outlet />

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <img src="/logo.png" alt="Farol Tech" style={{ height: 40, marginBottom: 10 }} />
              <p>Sites, aplicativos e identidade visual para o seu negócio.</p>
            </div>
            <div>
              <h5>Serviços</h5>
              {SERVICES.slice(0, 3).map((s) => <Link key={s.slug} to={`/servicos/${s.slug}`}>{s.name.split(' ')[0]}</Link>)}
            </div>
            <div>
              <h5>Empresa</h5>
              <Link to="/sobre">Sobre nós</Link>
              <Link to="/clientes">Clientes</Link>
              <Link to="/contactos">Contactos</Link>
            </div>
            <div>
              <h5>Contacto directo</h5>
              <p>Pemba, Cabo Delgado, Moçambique</p>
              <a href="mailto:contacto@faroltechmz.com">contacto@faroltechmz.com</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Farol Tech.</span>
            <span>Pemba, Moçambique</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
