import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Check, ChevronRight, Copy } from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';
import { copyText, useCopiedFlag } from '../lib/clipboard';
import CouponSheet from './CouponSheet';

type SheetName = 'magalu' | 'yesstyle';

interface Partner {
  name: string;
  description: string;
  couponCode: string;
  benefit: string;
  href: string;
  logo: string;
  // Opens an explanation sheet instead of going straight to the store.
  sheet?: SheetName;
}

interface MagaluCoupon {
  code: string;
  discount: string;
  minimumPurchase: string;
}

const YESSTYLE_CODE = 'CECILIA010';

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
    description: 'Acumula com cupom',
    couponCode: YESSTYLE_CODE,
    benefit: 'até 5% OFF',
    href: brandLinks.yesStyle,
    logo: '/images/logo-yesstyle.jpg',
    sheet: 'yesstyle',
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

function CouponTicket({
  partner,
  onOpenSheet,
}: {
  partner: Partner;
  onOpenSheet: (sheet: SheetName) => void;
}) {
  const stubRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useCopiedFlag();

  const handleCopy = async () => {
    await copyText(partner.couponCode);
    setCopied(true);
    tugStub(stubRef.current);
    trackEvent('copy_coupon', { coupon_code: partner.couponCode, partner: partner.name });
  };

  const handleStoreClick = (event: React.MouseEvent) => {
    if (partner.sheet) {
      event.preventDefault();
      onOpenSheet(partner.sheet);
      return;
    }
    trackEvent('click_coupon_store', { partner: partner.name, link_url: partner.href });
  };

  return (
    <article className="ticket coupon-card">
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        className="ticket-store"
        onClick={handleStoreClick}
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
          <span className="ticket-name">
            MAGALU
            <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="ticket-description">Meus cupons exclusivos</span>
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

function CopyButton({ code, onCopied }: { code: string; onCopied?: () => void }) {
  const [copied, setCopied] = useCopiedFlag();

  const handleCopy = async () => {
    await copyText(code);
    setCopied(true);
    onCopied?.();
  };

  return (
    <button type="button" className="sheet-copy" onClick={handleCopy} aria-label={`Copiar ${code}`}>
      {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

function MagaluSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <CouponSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Meus cupons na Magalu"
      storeHref={brandLinks.magalu}
      storeLabel="Abrir minha loja na Magalu"
      onStoreClick={() => trackEvent('click_magalu_store', { link_url: brandLinks.magalu })}
    >
      <p className="sheet-note">
        Estes cupons funcionam só na minha loja Magazine Você. No app ou no site comum da Magalu
        eles não são aceitos.
      </p>
      <ul className="sheet-list">
        {magaluCoupons.map((coupon) => (
          <li key={coupon.code} className="sheet-row">
            <span className="sheet-row-title">{coupon.discount}</span>
            <span className="sheet-row-detail">
              Compras acima de {coupon.minimumPurchase.replace(' ', ' ')}
            </span>
            <span className="sheet-row-code">{coupon.code}</span>
            <CopyButton
              code={coupon.code}
              onCopied={() => trackEvent('copy_magalu_coupon', { coupon_code: coupon.code })}
            />
          </li>
        ))}
      </ul>
    </CouponSheet>
  );
}

function YesStyleSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <CouponSheet
      isOpen={isOpen}
      onClose={onClose}
      title="CECILIA010 é um Reward Code"
      storeHref={brandLinks.yesStyle}
      storeLabel="Ir para a YesStyle"
      onStoreClick={() =>
        trackEvent('click_coupon_store', { partner: 'YesStyle', link_url: brandLinks.yesStyle })
      }
    >
      <p className="sheet-note">
        Ele não vai no campo de cupom. Por isso dá para somar com os cupons promocionais da loja.
      </p>
      <div className="sheet-row">
        <span className="sheet-row-title">{YESSTYLE_CODE}</span>
        <span className="sheet-row-detail">Até 5% extra: 5% na 1ª compra, 2% nas seguintes</span>
        <CopyButton
          code={YESSTYLE_CODE}
          onCopied={() =>
            trackEvent('copy_coupon', { coupon_code: YESSTYLE_CODE, partner: 'YesStyle' })
          }
        />
      </div>
      <ol className="sheet-steps">
        <li>Copie o código {YESSTYLE_CODE}.</li>
        <li>
          No carrinho da YesStyle, cole no campo <strong>Reward Code</strong>.
        </li>
        <li>
          Se tiver um cupom da loja, use no campo <strong>Coupon Code</strong>. Os dois descontos
          somam.
        </li>
      </ol>
    </CouponSheet>
  );
}

export default function CouponSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const [openSheet, setOpenSheet] = useState<SheetName | null>(null);
  const closeSheet = () => setOpenSheet(null);

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
          <CouponTicket key={partner.name} partner={partner} onOpenSheet={setOpenSheet} />
        ))}
        <MagaluTicket onOpen={() => setOpenSheet('magalu')} />
      </div>

      <MagaluSheet isOpen={openSheet === 'magalu'} onClose={closeSheet} />
      <YesStyleSheet isOpen={openSheet === 'yesstyle'} onClose={closeSheet} />
    </section>
  );
}
