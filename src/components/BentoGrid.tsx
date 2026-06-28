import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Bell, BookOpen, Globe, Handshake, MessageCircle } from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';

interface HighlightItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  cardClass: string;
  iconBg: string;
  iconColor: string;
  tag: string;
  attentionClass?: string;
  enabled?: boolean;
}

const highlights: HighlightItem[] = [
  {
    href: brandLinks.whatsappGroup,
    icon: <MessageCircle size={24} strokeWidth={1.5} />,
    label: 'Grupo WhatsApp',
    description: 'As melhores promoções e cupons em primeira mão',
    cardClass: 'whatsapp-card',
    iconBg: 'rgba(37, 211, 102, 0.12)',
    iconColor: '#25D366',
    tag: 'Comunidade',
    attentionClass: 'attention-whatsapp',
  },
  {
    href: brandLinks.site,
    icon: <Globe size={24} strokeWidth={1.5} />,
    label: 'Procurando minhas receitas?',
    description: 'Aqui tem Receitas, Reviews e muito mais',
    cardClass: 'bento-card',
    iconBg: 'rgba(26, 77, 46, 0.15)',
    iconColor: '#4ade80',
    tag: 'Site',
    attentionClass: 'attention-site',
  },
  {
    href: brandLinks.damie,
    icon: <Handshake size={24} strokeWidth={1.5} />,
    label: 'Damie & CECILIA12',
    description: 'Conheça mais sobre os produtos e minha opinião pessoal',
    cardClass: 'bento-card',
    iconBg: 'rgba(255, 215, 0, 0.12)',
    iconColor: '#ffd700',
    tag: 'Parceria',
  },
  {
    href: brandLinks.airFryerEbook,
    icon: <BookOpen size={24} strokeWidth={1.5} />,
    label: 'E-book Air Fryer',
    description: 'Receba novidades sobre o próximo guia da Cecília',
    cardClass: 'bento-card',
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: 'rgba(255, 255, 255, 0.7)',
    tag: 'Em breve',
    enabled: false,
  },
];

const activeHighlights = highlights.filter((item) => item.enabled !== false);

function BentoCard({ item, index }: { item: HighlightItem; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 10, scale: 0.99 },
      {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
        delay: 0.25 + index * 0.05,
      }
    );
  }, [index]);

  return (
    <a
      ref={cardRef}
      href={item.href}
      target={item.href.startsWith('http') ? '_blank' : undefined}
      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={`${item.label}: ${item.description}`}
      className={`${item.cardClass} ${item.attentionClass ?? ''} main-link-card ${
        isActive ? 'is-active' : ''
      } flex items-center gap-3.5 px-4 py-3 w-full text-white no-underline cursor-pointer`}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      onClick={() =>
        trackEvent('click_main_link', {
          link_label: item.label,
          link_url: item.href,
        })
      }
    >
      <span
        className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
        style={{ background: item.iconBg }}
      >
        <span style={{ color: item.iconColor }}>{item.icon}</span>
      </span>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <span
          key={isActive ? 'description' : 'label'}
          className="main-link-title text-[14px] font-semibold tracking-wide"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {isActive ? item.description : item.label}
        </span>
      </div>

      <span
        className="text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          color: 'rgba(255, 255, 255, 0.35)',
          letterSpacing: '0.04em',
        }}
      >
        {item.tag}
      </span>
    </a>
  );
}

export default function BentoGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bento-tag',
        { y: 6 },
        { y: 0, duration: 0.35, ease: 'power3.out', delay: 0.2 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-4 pt-3 pb-1" aria-labelledby="links-title">
      <h2 id="links-title" className="sr-only">
        Links principais
      </h2>
      <div className="flex justify-center mb-3">
          <span className="section-tag bento-tag">
          <Bell size={11} strokeWidth={2} />
          Links
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {activeHighlights.map((item, i) => (
          <BentoCard key={item.label} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
