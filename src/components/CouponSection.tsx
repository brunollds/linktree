import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Copy, Check, Percent } from 'lucide-react';
import { brandLinks } from '../data/site';

interface Partner {
  name: string;
  description: string;
  couponCode: string;
  benefit?: string;
  interactionTitle: string;
  interactionDescription: string;
  href: string;
  logo: string;
  logoAlt: string;
}

const partners: Partner[] = [
  {
    name: 'Damie',
    description: 'Móveis premium: sofás, poltronas e camas',
    couponCode: 'CECILIA12',
    benefit: '12% OFF',
    interactionTitle: 'Use CECILIA12',
    interactionDescription: '12% OFF na sua compra',
    href: brandLinks.damie,
    logo: '/images/logo-damie.jpg',
    logoAlt: 'Logo da Damie para cupom CECILIA12',
  },
  {
    name: 'Dolce Gusto',
    description: 'Cafeteiras e cápsulas',
    couponCode: 'CECI',
    benefit: '5% OFF',
    interactionTitle: 'Use CECI',
    interactionDescription: '5% OFF na sua compra',
    href: brandLinks.dolceGusto,
    logo: '/images/logo-dolcegusto.avif',
    logoAlt: 'Logo da Dolce Gusto para cupom CECI',
  },
  {
    name: 'YesStyle',
    description: 'Combine: Cupom + CECILIA010',
    couponCode: 'CECILIA010',
    benefit: '5% OFF',
    interactionTitle: 'Use CECILIA010 + outro cupom',
    interactionDescription: 'Combine com qualquer cupom disponível',
    href: brandLinks.yesStyle,
    logo: '/images/logo-yesstyle.jpg',
    logoAlt: 'Logo da YesStyle para código CECILIA010',
  },
  {
    name: 'Nestlé Nutre',
    description: 'Nutrição, vitaminas e bem-estar',
    couponCode: 'CECI',
    benefit: '5% OFF',
    interactionTitle: 'Use CECI',
    interactionDescription: '5% OFF na sua compra',
    href: brandLinks.nestleNutre,
    logo: '/images/logo-nestle-nutre.png',
    logoAlt: 'Logo da Nestlé Nutre para cupom CECI',
  },
  {
    name: 'I Wanna Sleep',
    description: 'Sono, conforto e bem-estar',
    couponCode: 'CECIEMCASA',
    benefit: '10% OFF',
    interactionTitle: 'Use CECIEMCASA',
    interactionDescription: '10% OFF na sua compra',
    href: brandLinks.iWannaSleep,
    logo: '/images/logo-i-wanna-sleep.avif',
    logoAlt: 'Logo da I Wanna Sleep para cupom CECIEMCASA',
  },
];

function CouponCard({ partner, index }: { partner: Partner; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(partner.couponCode).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = partner.couponCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [partner.couponCode]
  );

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 10 },
      {
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
        delay: 0.4 + index * 0.05,
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`coupon-card ${isActive ? 'is-active' : ''}`}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
    >
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        className="coupon-main"
        aria-label={`Abrir ${partner.name} usando o código ${partner.couponCode}`}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      >
        <span className="coupon-logo">
          <img src={partner.logo} alt={partner.logoAlt} loading="lazy" />
        </span>

        <div className="coupon-content">
          <div className="flex items-center gap-2">
            <span
              key={isActive ? 'interaction' : 'name'}
              className="coupon-title text-[13px] font-semibold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {isActive ? partner.interactionTitle : partner.name}
            </span>
            {partner.benefit && (
              <span className="coupon-benefit-chip">{partner.benefit}</span>
            )}
          </div>
          <span className="coupon-description">
            {isActive ? partner.interactionDescription : partner.description}
          </span>
        </div>
      </a>

      <button
        onClick={handleCopy}
        className="coupon-stub"
        title={`Copiar ${partner.couponCode}`}
        aria-label={`Copiar código ${partner.couponCode}`}
      >
        {copied ? (
          <>
            <Check size={14} />
            <span>Copiado</span>
          </>
        ) : (
          <>
            <small>Copiar</small>
            <span>{partner.couponCode}</span>
            <Copy size={12} />
          </>
        )}
      </button>
    </div>
  );
}

export default function CouponSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.coupon-section-tag',
        { y: 6 },
        { y: 0, duration: 0.35, ease: 'power3.out', delay: 0.35 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-4 pt-4 pb-1" aria-labelledby="cupons-title">
      <h2 id="cupons-title" className="sr-only">
        Cupons da Cecília
      </h2>
      <div className="flex justify-center mb-3">
        <span className="section-tag coupon-section-tag">
          <Percent size={11} strokeWidth={2} />
          Cupons
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {partners.map((partner, i) => (
          <CouponCard key={partner.name} partner={partner} index={i} />
        ))}
      </div>
    </section>
  );
}
