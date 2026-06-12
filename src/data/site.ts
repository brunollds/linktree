export interface BrandLinks {
  contactEmail: string;
  contactMailto: string;
  mediaKit: string;
  whatsappGroup: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  facebook: string;
  kwai: string;
  x: string;
  dicas: string;
  site: string;
  damie: string;
  dolceGusto: string;
  yesStyle: string;
  airFryerEbook: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  store: string;
  coupon?: string;
  url: string;
  image?: string;
}

export const brandLinks: BrandLinks = {
  contactEmail: 'contato@emcasacomcecilia.com',
  contactMailto: 'mailto:contato@emcasacomcecilia.com',
  mediaKit: 'https://mk.emcasacomcecilia.com',
  whatsappGroup: 'https://chat.whatsapp.com/GwouQfaZMrj32j7pKOIZbQ',
  instagram: 'https://instagram.com/emcasacomcecilia',
  youtube: 'https://youtube.com/@emcasacomcecilia',
  tiktok: 'https://tiktok.com/@emcasacomcecilia',
  facebook: 'https://facebook.com/emcasacomcecilia',
  kwai: 'https://kwai.com/@emcasacomcecilia',
  x: 'https://x.com/emcasacecilia',
  dicas: 'https://dicas.emcasacomcecilia.com',
  site: 'https://emcasacomcecilia.com',
  damie:
    'https://www.damie.com.br/?utm_source=home&utm_medium=blog&utm_campaign=cecilia12',
  dolceGusto: 'https://www.nescafe-dolcegusto.com.br/',
  yesStyle:
    'https://www.yesstyle.com/pt/home.html?rco=CECILIA010&utm_term=CECILIA010&utm_medium=Influencer&utm_source=dynamic&mcg=influencer',
  airFryerEbook:
    'mailto:contato@emcasacomcecilia.com?subject=Quero%20saber%20sobre%20o%20E-book%20Air%20Fryer',
};

export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
