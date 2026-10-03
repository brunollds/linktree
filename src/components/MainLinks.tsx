import { ArrowUpRight, Armchair, BookOpen, Utensils } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';

interface LinkItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  attentionClass?: string;
  enabled?: boolean;
}

const links: LinkItem[] = [
  {
    href: brandLinks.recipes,
    icon: <Utensils size={22} strokeWidth={1.8} />,
    label: 'Procurando minhas receitas?',
    description: 'Receitas que eu testo e aprovo em casa',
    attentionClass: 'attention-site',
  },
  {
    href: brandLinks.damieReviews,
    icon: <Armchair size={22} strokeWidth={1.8} />,
    label: 'Reviews e guias Damie',
    description: 'Qual poltrona ou sofá escolher',
  },
  {
    href: brandLinks.airFryerEbook,
    icon: <BookOpen size={22} strokeWidth={1.8} />,
    label: 'E-book Air Fryer',
    description: 'Receba novidades sobre o próximo guia da Cecília',
    enabled: false,
  },
];

const activeLinks = links.filter((item) => item.enabled !== false);

function trackLink(label: string, href: string) {
  trackEvent('click_main_link', { link_label: label, link_url: href });
}

export default function MainLinks() {
  return (
    <section className="main-links" aria-labelledby="links-title">
      <h2 id="links-title" className="sr-only">
        Links principais
      </h2>

      <a
        href={brandLinks.whatsappGroup}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-link attention-whatsapp"
        onClick={() => trackLink('Grupo WhatsApp', brandLinks.whatsappGroup)}
      >
        <FaWhatsapp size={28} aria-hidden="true" />
        <span className="link-text">
          <strong>Promoções no WhatsApp</strong>
          <span>Cupons e ofertas em primeira mão</span>
        </span>
        <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" />
      </a>

      <ul className="link-list">
        {activeLinks.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`link-row ${item.attentionClass ?? ''}`}
              onClick={() => trackLink(item.label, item.href)}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="link-text">
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </span>
              <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
