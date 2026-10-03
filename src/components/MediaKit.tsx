import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Mail } from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';

interface Stat {
  label: string;
  value: number;
  decimals: number;
  prefix?: string;
  suffix: string;
}

const stats: Stat[] = [
  { label: 'Seguidores totais', value: 557, decimals: 0, prefix: '+', suffix: ' mil' },
  { label: 'Visualizações em 90 dias', value: 10.3, decimals: 1, suffix: ' mi' },
  { label: 'Contas alcançadas no Instagram', value: 2.5, decimals: 1, suffix: ' mi' },
  { label: 'Audiência feminina', value: 85, decimals: 0, suffix: '%' },
];

function formatStat(stat: Stat, value = stat.value) {
  const number = value.toLocaleString('pt-BR', {
    minimumFractionDigits: stat.decimals,
    maximumFractionDigits: stat.decimals,
  });
  return `${stat.prefix ?? ''}${number}${stat.suffix}`;
}

function useCountUp(listRef: React.RefObject<HTMLDListElement | null>) {
  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const outputs = [...list.querySelectorAll<HTMLElement>('[data-stat]')];
    let tween: gsap.core.Tween | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const progress = { value: 0 };
        tween = gsap.to(progress, {
          value: 1,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            outputs.forEach((output) => {
              const stat = stats[Number(output.dataset.stat)];
              output.textContent = formatStat(stat, stat.value * progress.value);
            });
          },
        });
      },
      { threshold: 0.6 },
    );

    observer.observe(list);
    return () => {
      observer.disconnect();
      tween?.kill();
      outputs.forEach((output) => {
        output.textContent = formatStat(stats[Number(output.dataset.stat)]);
      });
    };
  }, [listRef]);
}

export default function MediaKit() {
  const listRef = useRef<HTMLDListElement>(null);
  useCountUp(listRef);

  return (
    <section className="page-section" aria-labelledby="marcas-title">
      <div className="section-head">
        <h2 id="marcas-title">Para marcas</h2>
        <span className="section-meta">Dados de agosto de 2026</span>
      </div>

      <div className="kit">
        <p className="kit-lede">Para marcas que querem entrar na casa de verdade.</p>

        <dl ref={listRef} className="kit-stats">
          {stats.map((stat, index) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>
                <span aria-hidden="true" data-stat={index}>
                  {formatStat(stat)}
                </span>
                <span className="sr-only">{formatStat(stat)}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="kit-actions">
          <a
            href={brandLinks.mediaKit}
            target="_blank"
            rel="noopener noreferrer"
            className="kit-primary"
            onClick={() => trackEvent('click_media_kit', { link_url: brandLinks.mediaKit })}
          >
            Ver mídia kit completo
            <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </a>
          <a
            href={brandLinks.contactMailto}
            className="kit-secondary"
            onClick={() =>
              trackEvent('click_contact_email', { link_url: brandLinks.contactMailto })
            }
          >
            <Mail size={17} strokeWidth={2} aria-hidden="true" />
            {brandLinks.contactEmail}
          </a>
        </div>
      </div>
    </section>
  );
}
