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
  recipes: string;
  damie: string;
  damieReviews: string;
  dolceGusto: string;
  yesStyle: string;
  nestleNutre: string;
  iWannaSleep: string;
  letsEatIt: string;
  magalu: string;
  airFryerEbook: string;
}

export interface Offer {
  id: string;
  title: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  store: string;
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
  recipes: 'https://emcasacomcecilia.com/receitas',
  damie:
    'https://www.damie.com.br/?utm_source=home&utm_medium=blog&utm_campaign=cecilia12',
  damieReviews: 'https://damie.emcasacomcecilia.com',
  dolceGusto: 'https://www.nescafe-dolcegusto.com.br/',
  yesStyle: 'https://ystyle.co/rQYQv',
  nestleNutre: 'https://www.nestlenutre.com.br/',
  iWannaSleep: 'https://www.iwannasleep.com.br/',
  letsEatIt:
    'https://letseatit.com.br/?utm_source=embaixador&utm_medium=emcasacomcecilia&utm_campaign=inbazz&utm_content=organico',
  magalu: 'https://www.magazinevoce.com.br/magazineemcasacomcecilia/',
  airFryerEbook:
    'mailto:contato@emcasacomcecilia.com?subject=Quero%20saber%20sobre%20o%20E-book%20Air%20Fryer',
};

export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
