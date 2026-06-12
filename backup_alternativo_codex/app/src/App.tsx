import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  Share2,
  Sparkles,
} from 'lucide-react'
import {
  coupons,
  primaryLinks,
  profile,
  secondaryLinks,
  type Coupon,
  type LinkItem,
} from './content'

function LinkCard({ item, compact = false }: { item: LinkItem; compact?: boolean }) {
  const Icon = item.icon

  return (
    <a
      className={`link-card accent-${item.accent}${compact ? ' link-card--compact' : ''}`}
      href={item.href}
      target="_blank"
      rel="noreferrer"
    >
      <span className="link-card__icon" aria-hidden="true">
        <Icon size={compact ? 19 : 22} strokeWidth={1.8} />
      </span>
      <span className="link-card__copy">
        <span className="link-card__title">
          {item.title}
          {item.label && <span className="link-card__label">{item.label}</span>}
        </span>
        <span className="link-card__description">{item.description}</span>
      </span>
      <ArrowUpRight className="link-card__arrow" size={18} aria-hidden="true" />
    </a>
  )
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false)

  async function copyCoupon() {
    await navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <article className="coupon">
      <a href={coupon.href} target="_blank" rel="noreferrer" className="coupon__brand">
        <img src={coupon.logo} alt="" />
        <span>
          <strong>{coupon.brand}</strong>
          <small>{coupon.description}</small>
        </span>
      </a>
      <span className="coupon__benefit">{coupon.benefit}</span>
      <button type="button" className="coupon__code" onClick={copyCoupon}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
        <span>{copied ? 'Copiado' : coupon.code}</span>
      </button>
    </article>
  )
}

export default function App() {
  const [shared, setShared] = useState(false)

  async function shareProfile() {
    const data = {
      title: 'Em Casa Com Cecília',
      text: 'Cupons, achados e conteúdos escolhidos pela Cecília.',
      url: window.location.href,
    }

    if (navigator.share) {
      await navigator.share(data)
      return
    }

    await navigator.clipboard.writeText(window.location.href)
    setShared(true)
    window.setTimeout(() => setShared(false), 1800)
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <section className="profile" aria-labelledby="profile-name">
        <div className="profile__topline">
          <span className="eyebrow">
            <Sparkles size={14} />
            curadoria da cecília
          </span>
          <button className="share-button" type="button" onClick={shareProfile}>
            {shared ? <Check size={17} /> : <Share2 size={17} />}
            <span>{shared ? 'Link copiado' : 'Compartilhar'}</span>
          </button>
        </div>

        <div className="profile__identity">
          <div className="avatar-wrap">
            <img src={profile.avatar} alt={`Foto de ${profile.name}`} />
            <span aria-label="Perfil verificado">✓</span>
          </div>
          <div>
            <p className="profile__handle">{profile.handle}</p>
            <h1 id="profile-name">{profile.name}</h1>
            <p className="profile__bio">{profile.bio}</p>
          </div>
        </div>
      </section>

      <section className="hero-card">
        <div>
          <span className="hero-card__tag">Comece por aqui</span>
          <h2>As melhores descobertas chegam primeiro na comunidade.</h2>
          <p>Promoções verificadas, cupons e dicas sem precisar procurar.</p>
        </div>
        <a
          href="https://chat.whatsapp.com/GwouQfaZMrj32j7pKOIZbQ"
          target="_blank"
          rel="noreferrer"
          className="hero-card__cta"
        >
          Entrar no WhatsApp
          <ChevronRight size={18} />
        </a>
      </section>

      <section className="content-section" aria-labelledby="essential-title">
        <div className="section-heading">
          <div>
            <span>Seleção essencial</span>
            <h2 id="essential-title">Tudo em um só lugar</h2>
          </div>
          <p>Escolha seu próximo destino</p>
        </div>
        <div className="primary-grid">
          {primaryLinks.map((item) => (
            <LinkCard item={item} key={item.title} />
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="coupon-title">
        <div className="section-heading">
          <div>
            <span>Benefícios da comunidade</span>
            <h2 id="coupon-title">Cupons da Cecília</h2>
          </div>
          <p>Toque no código para copiar</p>
        </div>
        <div className="coupon-list">
          {coupons.map((coupon) => (
            <CouponCard coupon={coupon} key={coupon.brand} />
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="more-title">
        <div className="section-heading">
          <div>
            <span>Explore mais</span>
            <h2 id="more-title">Outros canais</h2>
          </div>
        </div>
        <div className="secondary-grid">
          {secondaryLinks.map((item) => (
            <LinkCard item={item} compact key={item.title} />
          ))}
        </div>
      </section>

      <footer>
        <span>Em Casa Com Cecília</span>
        <p>Conteúdo, casa e escolhas com intenção.</p>
      </footer>
    </main>
  )
}
