import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Zap, ChevronLeft, ChevronRight, ExternalLink, ShoppingBag, Tag } from 'lucide-react';
import { brandLinks, formatPrice, type Offer } from '../data/site';
import { trackEvent } from '../lib/analytics';
import { fetchDicasOffers } from '../services/dicasOffers';

export default function PromoFeed() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchDicasOffers(controller.signal)
      .then((items) => {
        setOffers(items);
        setLoadFailed(false);
        requestAnimationFrame(updateScrollState);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLoadFailed(true);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.promo-tag',
        { y: 6 },
        { y: 0, duration: 0.35, ease: 'power3.out', delay: 0.3 }
      );

      gsap.fromTo(
        '.promo-carousel',
        { y: 10 },
        { y: 0, duration: 0.4, ease: 'power3.out', delay: 0.35 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -180 : 180, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section ref={sectionRef} className="w-full pt-5 pb-1">
      <div className="flex items-center justify-between px-4 mb-3">
        <span className="section-tag promo-tag">
          <Zap size={11} strokeWidth={2} />
          Ofertas do Dia
        </span>

        <div className="flex gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: canScrollLeft
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: canScrollLeft ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
              cursor: canScrollLeft ? 'pointer' : 'default',
            }}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: canScrollRight
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: canScrollRight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
              cursor: canScrollRight ? 'pointer' : 'default',
            }}
            disabled={!canScrollRight}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="promo-carousel flex gap-2.5 overflow-x-auto px-4 pb-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onScroll={updateScrollState}
      >
        {offers.length === 0 && (
          <a
            href={brandLinks.dicas}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-5 text-xs no-underline"
            style={{
              color: 'rgba(255,255,255,0.65)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <ExternalLink size={14} />
            {loadFailed ? 'Não foi possível carregar as ofertas. Ver no Dicas' : 'Carregando ofertas...'}
          </a>
        )}
        {offers.map((promo) => (
          <a
            key={promo.id}
            href={promo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 group cursor-pointer no-underline"
            style={{ width: '155px' }}
            onClick={() =>
              trackEvent('click_offer', {
                offer_id: promo.id,
                offer_title: promo.title,
                offer_store: promo.store,
              })
            }
          >
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,107,53,0.25)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {promo.coupon && (
                <div
                  className="absolute top-2 left-2 z-10 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(255,215,0,0.2)',
                    color: '#ffd700',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <Tag size={8} />
                    {promo.coupon}
                  </span>
                </div>
              )}

              {promo.discount > 0 && (
                <span
                  className="absolute top-2 right-2 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(255,107,53,0.88)',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(61, 65, 55, 0.16)',
                  }}
                >
                  -{promo.discount}%
                </span>
              )}

              <div className="flex items-center justify-center p-4" style={{ height: '90px' }}>
                {promo.image ? (
                  <img
                    src={promo.image}
                    alt=""
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span
                    className="flex w-12 h-12 items-center justify-center rounded-xl"
                    style={{
                      color: '#ff8a5c',
                      background: 'rgba(255,107,53,0.12)',
                    }}
                  >
                    <ShoppingBag size={22} strokeWidth={1.5} />
                  </span>
                )}
              </div>

              <div className="px-3 pb-2.5">
                <span
                  className="block text-[9px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {promo.store}
                </span>
                <p
                  className="text-[11px] font-medium leading-tight line-clamp-2 mb-1.5"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                >
                  {promo.title}
                </p>

                <div className="flex items-center gap-1.5">
                  {promo.originalPrice > promo.discountPrice && (
                    <span
                      className="text-[10px] line-through"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      {formatPrice(promo.originalPrice)}
                    </span>
                  )}
                  <span
                    className="text-[12px] font-bold"
                    style={{ color: '#4ade80' }}
                  >
                    {formatPrice(promo.discountPrice)}
                  </span>
                  <ExternalLink
                    size={10}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  />
                </div>
              </div>
            </div>
          </a>
        ))}
        <a
          href={brandLinks.dicas}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 group cursor-pointer no-underline"
          style={{ width: '155px' }}
          onClick={() =>
            trackEvent('click_all_offers', {
              destination: brandLinks.dicas,
            })
          }
        >
          <div
            className="flex h-full min-h-[196px] flex-col items-center justify-center gap-3 rounded-xl px-4 text-center"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,107,53,0.16), rgba(26,77,46,0.12))',
              border: '1px solid rgba(255,107,53,0.2)',
              color: '#ffffff',
            }}
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'rgba(255,107,53,0.18)', color: '#ff8a5c' }}
            >
              <ExternalLink size={20} strokeWidth={1.5} />
            </span>
            <span
              className="text-[13px] font-semibold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ver todas as ofertas
            </span>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Acesse o Dicas & Promoções
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
