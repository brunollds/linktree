import { brandLinks, type Offer } from '../data/site';

interface DicasPost {
  slug?: string;
  produto?: string;
  preco?: string | number;
  precoAntigo?: string | number;
  imagem?: string;
  loja?: string;
  categoria?: string;
  timestamp?: string;
  url?: string;
}

const DICAS_OFFERS_URL = `${brandLinks.dicas}/ultimos-posts-dicas.json`;

function parsePrice(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeImageUrl(value?: string): string | undefined {
  if (!value) return undefined;
  return value.replace(/^http:\/\//i, 'https://');
}

function normalizeDicasPost(post: DicasPost, index: number): Offer | null {
  const title = post.produto?.trim();
  const discountPrice = parsePrice(post.preco);
  const originalPrice = parsePrice(post.precoAntigo) || discountPrice;

  if (!title || !post.url || discountPrice <= 0) {
    return null;
  }

  const discount =
    originalPrice > discountPrice
      ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
      : 0;

  return {
    id: post.slug || `dicas-${index}`,
    title,
    description: post.categoria || 'Oferta selecionada pela Cecília',
    originalPrice,
    discountPrice,
    discount,
    store: post.loja || 'Dicas da Cecília',
    url: post.url,
    image: normalizeImageUrl(post.imagem),
  };
}

export async function fetchDicasOffers(signal?: AbortSignal): Promise<Offer[]> {
  const response = await fetch(DICAS_OFFERS_URL, {
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(`Dicas feed request failed: ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Dicas feed returned an invalid payload.');
  }

  return (data as DicasPost[])
    .slice(0, 10)
    .map(normalizeDicasPost)
    .filter((offer): offer is Offer => Boolean(offer));
}
