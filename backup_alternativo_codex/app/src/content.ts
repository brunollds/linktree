import {
  BadgePercent,
  Globe2,
  HeartHandshake,
  House,
  Instagram,
  MessageCircle,
  Play,
  type LucideIcon,
} from 'lucide-react'

export type LinkItem = {
  title: string
  description: string
  href: string
  icon: LucideIcon
  accent: 'forest' | 'clay' | 'gold'
  label?: string
}

export type Coupon = {
  brand: string
  description: string
  code: string
  benefit: string
  href: string
  logo: string
}

export const profile = {
  name: 'Cecília Mauad',
  handle: '@emcasacomcecilia',
  bio: 'Casa real, escolhas conscientes e achados que valem a pena.',
  avatar: './images/profile-mark.svg',
}

export const primaryLinks: LinkItem[] = [
  {
    title: 'Entre para a comunidade',
    description: 'Ofertas e cupons compartilhados primeiro no WhatsApp.',
    href: 'https://chat.whatsapp.com/GwouQfaZMrj32j7pKOIZbQ',
    icon: MessageCircle,
    accent: 'forest',
    label: 'Mais acessado',
  },
  {
    title: 'Achados e promoções',
    description: 'Seleção atualizada de produtos para casa e rotina.',
    href: 'https://dicas.emcasacomcecilia.com',
    icon: BadgePercent,
    accent: 'clay',
  },
  {
    title: 'Conteúdos da Cecília',
    description: 'Guias, reviews e ideias para uma casa com identidade.',
    href: 'https://emcasacomcecilia.com',
    icon: House,
    accent: 'gold',
  },
]

export const secondaryLinks: LinkItem[] = [
  {
    title: 'Instagram',
    description: 'Acompanhe os conteúdos diários',
    href: 'https://instagram.com/emcasacomcecilia',
    icon: Instagram,
    accent: 'clay',
  },
  {
    title: 'YouTube',
    description: 'Reviews e conteúdo em vídeo',
    href: 'https://youtube.com',
    icon: Play,
    accent: 'forest',
  },
  {
    title: 'Site oficial',
    description: 'Conheça todo o ecossistema',
    href: 'https://emcasacomcecilia.com',
    icon: Globe2,
    accent: 'gold',
  },
  {
    title: 'Parcerias',
    description: 'Mídia kit e contato comercial',
    href: 'https://mk.emcasacomcecilia.com',
    icon: HeartHandshake,
    accent: 'forest',
  },
]

export const coupons: Coupon[] = [
  {
    brand: 'Damie',
    description: 'Moda fitness & lifestyle',
    code: 'CECILIA12',
    benefit: '12% OFF',
    href: 'https://www.damie.com.br',
    logo: './images/logo-damie.png',
  },
  {
    brand: 'Dolce Gusto',
    description: 'Cafeteiras e cápsulas',
    code: 'CECI',
    benefit: '5% OFF',
    href: 'https://www.dolce-gusto.com.br',
    logo: './images/logo-dolcegusto.png',
  },
  {
    brand: 'YesStyle',
    description: 'Beleza asiática & moda',
    code: 'CECILIA010',
    benefit: '5% + recompensa',
    href: 'https://www.yesstyle.com',
    logo: './images/logo-yesstyle.png',
  },
]
