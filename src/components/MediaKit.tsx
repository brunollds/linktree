import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FileText, ExternalLink, TrendingUp, Users, Eye, Mail, Radio } from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';

export default function MediaKit() {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mediakit-tag',
        { y: 6 },
        { y: 0, duration: 0.35, ease: 'power3.out', delay: 0.55 }
      );

      gsap.fromTo(
        cardRef.current,
        { y: 10, scale: 0.99 },
        {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
          delay: 0.6,
        }
      );

      gsap.fromTo(
        '.stat-item',
        { y: 6 },
        {
          y: 0,
          duration: 0.3,
          ease: 'power3.out',
          stagger: 0.07,
          delay: 0.65,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: <Users size={13} />, value: '+550 mil', label: 'Seguidores totais' },
    { icon: <Eye size={13} />, value: '+10,7 mi', label: 'Visualizações · 3 meses' },
    { icon: <Radio size={13} />, value: '+6,6 mi', label: 'Contas e impressões' },
    { icon: <TrendingUp size={13} />, value: '7,4%', label: 'Engajamento Instagram' },
  ];

  return (
    <section className="w-full px-4 pt-4 pb-1">
      <div className="flex justify-center mb-3">
        <span className="section-tag mediakit-tag">
          <FileText size={11} strokeWidth={2} />
          Marcas
        </span>
      </div>

      <a
        ref={cardRef}
        href={brandLinks.mediaKit}
        target="_blank"
        rel="noopener noreferrer"
        className="mediakit-card block px-4 py-4 w-full text-white no-underline cursor-pointer"
      >
        {/* Top row */}
        <div className="flex items-center gap-3 mb-3.5">
          <span
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: 'rgba(255, 215, 0, 0.12)' }}
          >
            <FileText size={22} strokeWidth={1.5} style={{ color: '#ffd700' }} />
          </span>

          <div className="flex flex-col flex-1">
            <span
              className="text-[15px] font-semibold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Mídia Kit 2026
            </span>
            <span
              className="text-[11px] mt-px"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: 'rgba(255, 255, 255, 0.4)',
              }}
            >
              Dados, alcance e parcerias
            </span>
          </div>

          <span
            className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg"
            style={{
              background: 'rgba(255, 215, 0, 0.12)',
              color: '#ffd700',
            }}
          >
            <ExternalLink size={13} />
            Acessar
          </span>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 gap-2 pt-3"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-item flex flex-col items-center gap-1 py-2 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
              }}
            >
              <span style={{ color: 'rgba(255, 215, 0, 0.6)' }}>{stat.icon}</span>
              <span
                className="text-[12px] font-bold text-center"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: '#FFFFFF',
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-[8px] text-center leading-tight"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </a>

      <a
        href={brandLinks.contactMailto}
        className="brand-contact"
        onClick={() =>
          trackEvent('click_contact_email', {
            link_url: brandLinks.contactMailto,
          })
        }
      >
        <Mail size={14} strokeWidth={1.7} />
        <span>
          Contato comercial
          <strong>{brandLinks.contactEmail}</strong>
        </span>
      </a>
    </section>
  );
}
