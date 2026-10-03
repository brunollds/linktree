import { useEffect, useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';

export default function Header() {
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!linkCopied) return;
    const timeout = window.setTimeout(() => setLinkCopied(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [linkCopied]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Cecília Mauad',
          text: 'Confira os cupons e dicas da Cecília!',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setLinkCopied(true);
      }
    } catch {
      // Share sheet dismissed or clipboard unavailable.
    }
  };

  return (
    <header className="profile">
      <img
        src="/images/avatar-small.jpg"
        width={72}
        height={72}
        alt="Cecília Mauad do Em Casa com Cecília"
        className="profile-avatar"
      />

      <div className="profile-text">
        <a
          href={brandLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="profile-handle"
          onClick={() =>
            trackEvent('click_social', {
              social_network: 'Instagram',
              link_url: brandLinks.instagram,
            })
          }
        >
          @emcasacomcecilia
        </a>
        <h1 className="profile-name">
          Cecília Mauad
          <span className="sr-only"> | Em Casa com Cecília</span>
        </h1>
        <p className="profile-slogan">Receitas fáceis que dão certo.</p>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="share-btn"
        aria-label={linkCopied ? 'Link copiado' : 'Compartilhar esta página'}
      >
        {linkCopied ? (
          <Check size={19} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Share2 size={19} strokeWidth={1.8} aria-hidden="true" />
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {linkCopied ? 'Link da página copiado' : ''}
      </span>
    </header>
  );
}
