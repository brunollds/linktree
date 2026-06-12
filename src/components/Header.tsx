import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Share2 } from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';

export default function Header() {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLButtonElement>(null);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Cecília Mauad',
      text: 'Confira os cupons e dicas da Cecília!',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Could add a toast here
      }
    } catch {
      // User cancelled share
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        avatarRef.current,
        { y: 8 },
        { y: 0, duration: 0.45, ease: 'power3.out' }
        )
        .fromTo(
          profileRef.current,
          { x: -8 },
          { x: 0, duration: 0.4, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          shareRef.current,
          { y: -6 },
          { y: 0, duration: 0.35, ease: 'power3.out' },
          '-=0.3'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={containerRef}
      className="relative grid w-full grid-cols-[68px_1fr_40px] items-center gap-x-3 px-4 pb-2 pt-5"
    >
      <button
        ref={shareRef}
        onClick={handleShare}
        className="share-btn col-start-3 row-start-1"
        aria-label="Compartilhar"
      >
        <Share2 size={18} strokeWidth={1.5} />
      </button>

      <div className="relative col-start-1 row-start-1">
        <img
          ref={avatarRef}
          src="/images/avatar.jpg"
          alt="Cecília Mauad"
          className="profile-avatar relative h-[68px] w-[68px] rounded-full object-cover"
        />
      </div>

      <div
        ref={profileRef}
        className="col-start-2 row-start-1 min-w-0 text-left"
      >
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
        <h1 className="profile-name">Cecília Mauad</h1>
        <p className="profile-slogan">Receitas fáceis que dão certo.</p>
      </div>
    </header>
  );
}
