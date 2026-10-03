import { useEffect, useState } from 'react';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { brandLinks, formatPrice, type Offer } from '../data/site';
import { trackEvent } from '../lib/analytics';
import { useCarousel } from '../lib/useCarousel';
import { fetchDicasOffers } from '../services/dicasOffers';
import CarouselArrows from './CarouselArrows';

function OfferCard({ offer }: { offer: Offer }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <a
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer"
      className="offer-card"
      aria-label={`${offer.title}, por ${formatPrice(offer.discountPrice)}`}
      onClick={() =>
        trackEvent('click_offer', {
          offer_id: offer.id,
          offer_title: offer.title,
          offer_store: offer.store,
        })
      }
    >
      <span className="offer-image">
        {offer.image && !imageFailed ? (
          <img src={offer.image} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <ShoppingBag size={26} strokeWidth={1.6} aria-hidden="true" />
        )}
        {offer.discount > 0 && <span className="offer-discount">-{offer.discount}%</span>}
      </span>
      <span className="offer-prices">
        <strong>{formatPrice(offer.discountPrice)}</strong>
        {offer.originalPrice > offer.discountPrice && <s>{formatPrice(offer.originalPrice)}</s>}
      </span>
    </a>
  );
}

export default function PromoFeed() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const { scrollerRef, atStart, atEnd, scroll } = useCarousel<HTMLDivElement>(296);

  useEffect(() => {
    const controller = new AbortController();

    fetchDicasOffers(controller.signal)
      .then((items) => {
        setOffers(items);
        setLoadFailed(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLoadFailed(true);
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="carousel-section" aria-labelledby="ofertas-title">
      <div className="section-head">
        <h2 id="ofertas-title">Ofertas do dia</h2>
        <CarouselArrows
          atStart={atStart}
          atEnd={atEnd}
          onScroll={scroll}
          previousLabel="Ver ofertas anteriores"
          nextLabel="Ver próximas ofertas"
        />
      </div>

      {offers.length === 0 ? (
        <a href={brandLinks.dicas} target="_blank" rel="noopener noreferrer" className="carousel-empty">
          {loadFailed
            ? 'Não deu para carregar as ofertas agora. Ver todas no site de ofertas'
            : 'Carregando ofertas…'}
          <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </a>
      ) : (
        <div ref={scrollerRef} className="carousel">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
          <a
            href={brandLinks.dicas}
            target="_blank"
            rel="noopener noreferrer"
            className="carousel-more"
            onClick={() => trackEvent('click_all_offers', { destination: brandLinks.dicas })}
          >
            Ver todas as ofertas
            <ArrowUpRight size={20} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
      )}
    </section>
  );
}
