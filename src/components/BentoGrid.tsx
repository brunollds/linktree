import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Bell,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Handshake,
  MessageCircle,
  Ticket,
  X,
} from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';

interface HighlightItem {
  href?: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  cardClass: string;
  iconBg: string;
  iconColor: string;
  tag: string;
  attentionClass?: string;
  enabled?: boolean;
  action?: 'modal';
}

interface MagaluCoupon {
  code: string;
  discount: string;
  minimumPurchase: string;
}

const magaluCoupons: MagaluCoupon[] = [
  { code: '10EMCASACOMCECILIA', discount: 'R$ 10 OFF', minimumPurchase: 'R$ 499,90' },
  { code: '20EMCASACOMCECILIA', discount: 'R$ 20 OFF', minimumPurchase: 'R$ 999,90' },
  { code: '30EMCASACOMCECILIA', discount: 'R$ 30 OFF', minimumPurchase: 'R$ 1.499,90' },
  { code: '40EMCASACOMCECILIA', discount: 'R$ 40 OFF', minimumPurchase: 'R$ 1.999,90' },
  { code: '50EMCASACOMCECILIA', discount: 'R$ 50 OFF', minimumPurchase: 'R$ 2.499,90' },
  { code: '60EMCASACOMCECILIA', discount: 'R$ 60 OFF', minimumPurchase: 'R$ 2.999,90' },
  { code: '70EMCASACOMCECILIA', discount: 'R$ 70 OFF', minimumPurchase: 'R$ 3.499,90' },
  { code: '80EMCASACOMCECILIA', discount: 'R$ 80 OFF', minimumPurchase: 'R$ 3.999,90' },
  { code: '90EMCASACOMCECILIA', discount: 'R$ 90 OFF', minimumPurchase: 'R$ 4.499,90' },
  { code: '100EMCASACOMCECILIA', discount: 'R$ 100 OFF', minimumPurchase: 'R$ 4.999,90' },
];

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
    icon: <Ticket size={24} strokeWidth={1.5} />,
    label: 'Cupons Magalu',
    description: 'Copie seu cupom e compre na loja da Cecília',
    cardClass: 'bento-card',
    iconBg: 'rgba(0, 133, 255, 0.12)',
    iconColor: '#0086ff',
    tag: 'Ofertas',
    action: 'modal',
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

function BentoCard({ item, index, onOpenMagalu }: { item: HighlightItem; index: number; onOpenMagalu: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current, { y: 10, scale: 0.99 }, { y: 0, scale: 1, duration: 0.4, ease: 'power3.out', delay: 0.25 + index * 0.05 });
  }, [index]);

  const className = `${item.cardClass} ${item.attentionClass ?? ''} main-link-card ${isActive ? 'is-active' : ''} flex items-center gap-3.5 px-4 py-3 w-full text-white no-underline cursor-pointer`;
  const interactionProps = {
    onMouseEnter: () => setIsActive(true),
    onMouseLeave: () => setIsActive(false),
    onFocus: () => setIsActive(true),
    onBlur: () => setIsActive(false),
    onTouchStart: () => setIsActive(true),
    onTouchEnd: () => setIsActive(false),
  };
  const content = (
    <>
      <span className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0" style={{ background: item.iconBg }}>
        <span style={{ color: item.iconColor }}>{item.icon}</span>
      </span>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <span key={isActive ? 'description' : 'label'} className="main-link-title text-[14px] font-semibold tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {isActive ? item.description : item.label}
        </span>
      </div>
      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.04em' }}>
        {item.tag}
      </span>
    </>
  );

  return (
    <div ref={cardRef}>
      {item.action === 'modal' ? (
        <button type="button" aria-label={`${item.label}: ${item.description}`} className={`${className} border-0 text-left font-inherit`} {...interactionProps} onClick={onOpenMagalu}>
          {content}
        </button>
      ) : (
        <a href={item.href} target={item.href?.startsWith('http') ? '_blank' : undefined} rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label={`${item.label}: ${item.description}`} className={className} {...interactionProps} onClick={() => trackEvent('click_main_link', { link_label: item.label, link_url: item.href ?? '' })}>
          {content}
        </a>
      )}
    </div>
  );
}

function MagaluCouponDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const copyCoupon = useCallback((coupon: MagaluCoupon) => {
    navigator.clipboard.writeText(coupon.code).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = coupon.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
    setCopiedCode(coupon.code);
    window.setTimeout(() => setCopiedCode(null), 2000);
    trackEvent('copy_magalu_coupon', { coupon_code: coupon.code });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#173126]/35 p-3 sm:items-center" role="presentation">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar cupons Magalu" onClick={onClose} />
      <section role="dialog" aria-modal="true" aria-labelledby="magalu-coupons-title" className="relative z-10 flex max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-[#244a38]/15 bg-[#fffdf8] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#244a38]/10 px-5 py-4">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0086ff]">Magazine Você</p>
            <h2 id="magalu-coupons-title" className="font-['Space_Grotesk'] text-lg font-bold text-[#173126]">Cupons Magalu da Cecília</h2>
          </div>
          <button ref={closeButtonRef} type="button" className="rounded-lg p-2 text-[#52645a] transition hover:bg-[#244a38]/8 hover:text-[#173126]" aria-label="Fechar" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="overflow-y-auto px-5 py-4">
          <p className="rounded-xl border border-[#0086ff]/18 bg-[#0086ff]/7 px-3 py-2.5 text-xs leading-5 text-[#244a38]">Estes cupons funcionam somente pela loja Magazine Você da Cecília. Eles não são válidos no app ou no site comum da Magalu.</p>
          <div className="mt-4 space-y-2">
            {magaluCoupons.map((coupon) => {
              const copied = copiedCode === coupon.code;
              return (
                <div key={coupon.code} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-[#244a38]/10 bg-[#f8f3ea] px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-['Space_Grotesk'] text-xs font-bold text-[#173126]">{coupon.code}</p>
                    <p className="mt-0.5 text-[11px] text-[#52645a]">{coupon.discount} · Compra mínima {coupon.minimumPurchase}</p>
                  </div>
                  <button type="button" onClick={() => copyCoupon(coupon)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#b85f43]/25 bg-[#fffdf8] px-2.5 py-2 text-xs font-semibold text-[#a6533b] transition hover:bg-[#b85f43] hover:text-white" aria-label={`Copiar cupom ${coupon.code}`}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <footer className="border-t border-[#244a38]/10 bg-[#fffdf8] px-5 py-4">
          <a href={brandLinks.magalu} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click_magalu_store', { link_url: brandLinks.magalu })} className="flex items-center justify-center gap-2 rounded-xl bg-[#0086ff] px-4 py-3 text-sm font-bold text-white no-underline transition hover:bg-[#006fd6]">
            Abrir loja da Cecília <ExternalLink size={16} />
          </a>
        </footer>
      </section>
    </div>
  );
}

export default function BentoGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMagaluOpen, setIsMagaluOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.bento-tag', { y: 6 }, { y: 0, duration: 0.35, ease: 'power3.out', delay: 0.2 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-4 pt-3 pb-1" aria-labelledby="links-title">
      <h2 id="links-title" className="sr-only">Links principais</h2>
      <div className="flex justify-center mb-3">
        <span className="section-tag bento-tag"><Bell size={11} strokeWidth={2} />Links</span>
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {activeHighlights.map((item, i) => <BentoCard key={item.label} item={item} index={i} onOpenMagalu={() => setIsMagaluOpen(true)} />)}
      </div>
      <MagaluCouponDialog isOpen={isMagaluOpen} onClose={() => setIsMagaluOpen(false)} />
    </section>
  );
}
