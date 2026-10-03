import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Check, ChevronRight, Copy, X } from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';

interface Partner {
  name: string;
  description: string;
  couponCode: string;
  benefit: string;
  href: string;
  logo: string;
}

interface MagaluCoupon {
  code: string;
  discount: string;
  minimumPurchase: string;
}

const partners: Partner[] = [
  {
    name: 'Damie',
    description: 'Sofás e poltronas',
    couponCode: 'CECILIA12',
    benefit: '12% OFF',
    href: brandLinks.damie,
    logo: '/images/logo-damie.jpg',
  },
  {
    name: "Let's Eat It",
    description: 'Cozinha e mesa posta',
    couponCode: 'MAUAD',
    benefit: '5% OFF',
    href: brandLinks.letsEatIt,
    logo: '/images/logo-letseatit.png',
  },
  {
    name: 'Dolce Gusto',
    description: 'Cafeteiras e cápsulas',
    couponCode: 'CECI',
    benefit: '5% OFF',
    href: brandLinks.dolceGusto,
    logo: '/images/logo-dolcegusto.avif',
  },
  {
    name: 'YesStyle',
    description: 'Cupom cumulativo',
    couponCode: 'CECILIA010',
    benefit: '5% OFF',
    href: brandLinks.yesStyle,
    logo: '/images/logo-yesstyle.jpg',
  },
  {
    name: 'Nestlé Nutre',
    description: 'Nutrição e vitaminas',
    couponCode: 'CECI',
    benefit: '5% OFF',
    href: brandLinks.nestleNutre,
    logo: '/images/logo-nestle-nutre.png',
  },
  {
    name: 'I Wanna Sleep',
    description: 'Sono e conforto',
    couponCode: 'CECIEMCASA',
    benefit: '10% OFF',
    href: brandLinks.iWannaSleep,
    logo: '/images/logo-i-wanna-sleep.avif',
  },
];

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

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

function useCopiedFlag() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return [copied, setCopied] as const;
}

function tugStub(stub: HTMLElement | null) {
  if (!stub || prefersReducedMotion()) return;
  stub.animate(
    [
      { transform: 'translateY(0) rotate(0)' },
      { transform: 'translateY(4px) rotate(0.8deg)' },
      { transform: 'translateY(0) rotate(0)' },
    ],
    { duration: 280, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1.4)' },
  );
}

function CouponTicket({ partner }: { partner: Partner }) {
  const stubRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useCopiedFlag();

  const handleCopy = async () => {
    await copyText(partner.couponCode);
    setCopied(true);
    tugStub(stubRef.current);
    trackEvent('copy_coupon', { coupon_code: partner.couponCode, partner: partner.name });
  };

  return (
    <article className="ticket coupon-card">
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        className="ticket-store"
        onClick={() =>
          trackEvent('click_coupon_store', { partner: partner.name, link_url: partner.href })
        }
      >
        <span className="ticket-logo">
          <img src={partner.logo} alt="" />
        </span>
        <span className="ticket-info">
          <span className="ticket-name">
            {partner.name}
            <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="ticket-description">{partner.description}</span>
        </span>
      </a>

      <button
        ref={stubRef}
        type="button"
        className={`ticket-stub ${copied ? 'is-copied' : ''}`}
        onClick={handleCopy}
        aria-label={`Copiar cupom ${partner.couponCode} da ${partner.name}, ${partner.benefit}`}
      >
        <span className="ticket-benefit">{partner.benefit}</span>
        <span className="ticket-code">
          {partner.couponCode}
          <Copy size={13} strokeWidth={2.2} aria-hidden="true" />
        </span>
        {copied && (
          <span className="ticket-stamp" aria-hidden="true">
            Copiado
          </span>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `Cupom ${partner.couponCode} copiado` : ''}
      </span>
    </article>
  );
}

function MagaluTicket({ onOpen }: { onOpen: () => void }) {
  return (
    <article className="ticket coupon-card">
      <a
        href={brandLinks.magalu}
        target="_blank"
        rel="noopener noreferrer"
        className="ticket-store"
        onClick={() => trackEvent('click_magalu_store', { link_url: brandLinks.magalu })}
      >
        <span className="ticket-logo ticket-logo--magalu">
          <img src="/images/logo-magalu.webp" alt="" />
        </span>
        <span className="ticket-info">
          <span className="ticket-name ticket-name--wrap">
            Meus Cupons EXCLUSIVOS na MAGALU
            <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
          </span>
        </span>
      </a>

      <button
        type="button"
        className="ticket-stub"
        onClick={onOpen}
        aria-label="Ver os 10 cupons da Magalu, de R$ 10 a R$ 100 de desconto"
      >
        <span className="ticket-benefit">10 cupons</span>
        <span className="ticket-code">
          até R$ 100
          <ChevronRight size={15} strokeWidth={2.4} aria-hidden="true" />
        </span>
      </button>
    </article>
  );
}

function MagaluCouponRow({ coupon }: { coupon: MagaluCoupon }) {
  const [copied, setCopied] = useCopiedFlag();

  const handleCopy = async () => {
    await copyText(coupon.code);
    setCopied(true);
    trackEvent('copy_magalu_coupon', { coupon_code: coupon.code });
  };

  return (
    <li className="magalu-row">
      <span className="magalu-row-discount">{coupon.discount}</span>
      <span className="magalu-row-minimum">
        Compras acima de {coupon.minimumPurchase.replace(' ', '\u00a0')}
      </span>
      <span className="magalu-row-code">{coupon.code}</span>
      <button
        type="button"
        className="magalu-row-copy"
        onClick={handleCopy}
        aria-label={`Copiar cupom ${coupon.code}`}
      >
        {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        {copied ? 'Copiado' : 'Copiar'}
      </button>
    </li>
  );
}

function MagaluCouponDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="magalu-dialog"
      aria-labelledby="magalu-coupons-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="magalu-sheet">
        <header className="magalu-sheet-header">
          <h2 id="magalu-coupons-title">Meus cupons na Magalu</h2>
          <button type="button" className="magalu-close" aria-label="Fechar" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="magalu-sheet-body">
          <p className="magalu-rule">
            Estes cupons funcionam só na minha loja Magazine Você. No app ou no site comum da
            Magalu eles não são aceitos.
          </p>
          <ul className="magalu-list">
            {magaluCoupons.map((coupon) => (
              <MagaluCouponRow key={coupon.code} coupon={coupon} />
            ))}
          </ul>
        </div>

        <footer className="magalu-sheet-footer">
          <a
            href={brandLinks.magalu}
            target="_blank"
            rel="noopener noreferrer"
            className="magalu-store-link"
            onClick={() => trackEvent('click_magalu_store', { link_url: brandLinks.magalu })}
          >
            Abrir minha loja na Magalu
            <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </dialog>
  );
}

export default function CouponSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const [isMagaluOpen, setIsMagaluOpen] = useState(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.2 })
        .from('.ticket', {
          clipPath: 'inset(0% 0% 100% 0%)',
          y: -10,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.07,
          clearProps: 'clipPath',
        })
        .from(
          '.ticket-stub',
          {
            clipPath: 'inset(0% 0% 0% 100%)',
            duration: 0.3,
            ease: 'power2.out',
            stagger: 0.07,
            clearProps: 'clipPath',
          },
          0.3,
        );
    }, listRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="coupons" aria-labelledby="cupons-title">
      <div className="coupons-heading">
        <h2 id="cupons-title">Meus cupons</h2>
        <p className="hand-note">toque pra copiar</p>
      </div>

      <div ref={listRef} className="ticket-list">
        {partners.map((partner) => (
          <CouponTicket key={partner.name} partner={partner} />
        ))}
        <MagaluTicket onOpen={() => setIsMagaluOpen(true)} />
      </div>

      <MagaluCouponDialog isOpen={isMagaluOpen} onClose={() => setIsMagaluOpen(false)} />
    </section>
  );
}
