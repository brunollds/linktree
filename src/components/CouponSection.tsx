import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, ChevronRight, Copy } from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';
import { copyText, useCopiedFlag } from '../lib/clipboard';
import {
  MagaluSheet,
  SHEIN_CODE,
  SheinSheet,
  YESSTYLE_CODE,
  YesStyleSheet,
  type SheetName,
} from './CouponSheets';

interface Partner {
  name: string;
  description: string;
  couponCode: string;
  benefit: string;
  href: string;
  logo: string;
  // What screen readers call the code when it is not a regular coupon.
  codeNoun?: string;
  // Codes too long for one line in the stub wrap at this index.
  codeBreakAt?: number;
  // Opens an explanation sheet instead of going straight to the store.
  sheet?: SheetName;
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
    benefit: '10% OFF',
    href: brandLinks.dolceGusto,
    logo: '/images/logo-dolcegusto.avif',
  },
  {
    name: 'YesStyle',
    description: 'Acumula com cupom',
    couponCode: YESSTYLE_CODE,
    codeNoun: 'Reward Code',
    benefit: 'até 5% OFF',
    href: brandLinks.yesStyle,
    logo: '/images/logo-yesstyle.jpg',
    sheet: 'yesstyle',
  },
  {
    name: 'Nestlé Nutre',
    description: 'Nutrição e vitaminas',
    couponCode: 'CECI',
    benefit: '10% OFF',
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
  {
    name: 'Insider',
    description: 'Camisetas e underwear',
    couponCode: 'EMCASACOMCECILIA',
    codeBreakAt: 9,
    benefit: '15% OFF',
    href: brandLinks.insider,
    logo: '/images/logo-insider.png',
  },
  {
    name: 'Cléa Store',
    description: 'Moda feminina',
    couponCode: 'CSEMCASACOMCECILIA',
    codeBreakAt: 8,
    benefit: '10% OFF',
    href: brandLinks.cleaStore,
    logo: '/images/logo-clea-store.png',
  },
  {
    name: 'SHEIN',
    description: 'Moda, beleza e casa',
    couponCode: SHEIN_CODE,
    codeNoun: 'código de indicação',
    benefit: 'Indicação',
    href: brandLinks.shein,
    logo: '/images/logo-shein.png',
    sheet: 'shein',
  },
  {
    // The discount reaches 10% but can be lower on some items: always "até".
    name: 'Probiótica',
    description: 'Colágeno e whey',
    couponCode: 'PRO10EMCASACOMCECILIA',
    codeBreakAt: 11,
    benefit: 'até 10% OFF',
    href: brandLinks.probiotica,
    logo: '/images/logo-probiotica.png',
  },
  {
    // Same rule as Probiótica: always "até 10%".
    name: 'Max Titanium',
    description: 'Whey e pré-treinos',
    couponCode: 'MAX10EMCASACOMCECILIA',
    codeBreakAt: 11,
    benefit: 'até 10% OFF',
    href: brandLinks.maxTitanium,
    logo: '/images/logo-max-titanium.png',
  },
  {
    name: 'Black Skull',
    description: 'Suplementos',
    couponCode: 'CECILIA10',
    benefit: '10% OFF',
    href: brandLinks.blackSkull,
    logo: '/images/logo-black-skull.png',
  },
  {
    name: 'Dr. Peanut',
    description: 'Pasta de amendoim',
    couponCode: 'DREMCASACOMCECILIA',
    codeBreakAt: 8,
    benefit: '10% OFF',
    href: brandLinks.drPeanut,
    logo: '/images/logo-dr-peanut.png',
  },
  {
    name: 'Mais Mu',
    description: 'Snacks proteicos',
    couponCode: 'MMEMCASACOMCECILIA',
    codeBreakAt: 8,
    benefit: '10% OFF',
    href: brandLinks.maisMu,
    logo: '/images/logo-mais-mu.png',
  },
  {
    name: 'Belive',
    description: 'Doces sem glúten',
    couponCode: 'MAUAD',
    benefit: '10% OFF',
    href: brandLinks.belive,
    logo: '/images/logo-belive.png',
  },
  {
    name: 'Skelt',
    description: 'Autobronzeador',
    couponCode: 'SKEMCASACOMCECILIA',
    codeBreakAt: 8,
    benefit: '10% OFF',
    href: brandLinks.skelt,
    logo: '/images/logo-skelt.png',
  },
  {
    name: 'Bagaggio',
    description: 'Malas e mochilas',
    couponCode: 'CECILIA10',
    benefit: '10% OFF',
    href: brandLinks.bagaggio,
    logo: '/images/logo-bagaggio.png',
  },
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
  const { codeBreakAt, codeNoun = 'cupom' } = partner;

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
        aria-label={`Copiar ${codeNoun} ${partner.couponCode} da ${partner.name}, ${partner.benefit}`}
      >
        <span className="ticket-benefit">{partner.benefit}</span>
        <span className={`ticket-code ${codeBreakAt ? 'ticket-code--long' : ''}`}>
          {codeBreakAt ? (
            <span>
              {partner.couponCode.slice(0, codeBreakAt)}
              <wbr />
              {partner.couponCode.slice(codeBreakAt)}
            </span>
          ) : (
            partner.couponCode
          )}
          <Copy size={13} strokeWidth={2.2} aria-hidden="true" />
        </span>
        {copied && (
          <span className="ticket-stamp" aria-hidden="true">
            Copiado
          </span>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${partner.couponCode} copiado` : ''}
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

// Lejour is a referral sign-up, not a coupon: the whole ticket is one link and never says "cupom".
function LejourTicket() {
  return (
    <a
      href={brandLinks.lejour}
      target="_blank"
      rel="noopener noreferrer"
      className="ticket coupon-card"
      aria-label="Lejour: criar o site do casamento e a lista de presentes, com plano grátis"
      onClick={() => trackEvent('click_referral_link', { partner: 'Lejour', link_url: brandLinks.lejour })}
    >
      <span className="ticket-store">
        <span className="ticket-logo">
          <img src="/images/logo-lejour.png" alt="" />
        </span>
        <span className="ticket-info">
          <span className="ticket-name">Lejour</span>
          <span className="ticket-description">Lista de casamento</span>
        </span>
      </span>
      <span className="ticket-stub">
        <span className="ticket-benefit">Lista grátis</span>
        <span className="ticket-code">
          Criar
          <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden="true" />
        </span>
      </span>
    </a>
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
        <LejourTicket />
      </div>

      <MagaluSheet isOpen={openSheet === 'magalu'} onClose={closeSheet} />
      <YesStyleSheet isOpen={openSheet === 'yesstyle'} onClose={closeSheet} />
      <SheinSheet isOpen={openSheet === 'shein'} onClose={closeSheet} />
    </section>
  );
}
