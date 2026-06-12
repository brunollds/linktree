import { Share2 } from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { SiKuaishou } from 'react-icons/si';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';

const socials = [
  {
    href: brandLinks.instagram,
    icon: <FaInstagram />,
    label: 'Instagram',
  },
  {
    href: brandLinks.youtube,
    icon: <FaYoutube />,
    label: 'YouTube',
  },
  {
    href: brandLinks.x,
    icon: <FaXTwitter />,
    label: 'X / Twitter',
  },
  {
    href: brandLinks.tiktok,
    icon: <FaTiktok />,
    label: 'TikTok',
  },
  {
    href: brandLinks.facebook,
    icon: <FaFacebookF />,
    label: 'Facebook',
  },
  {
    href: brandLinks.kwai,
    icon: <SiKuaishou />,
    label: 'Kwai',
  },
];

export default function SocialLinks() {
  return (
    <section className="social-section w-full px-4 pt-5 pb-1">
      <div className="flex justify-center mb-3">
        <span className="section-tag">
          <Share2 size={11} strokeWidth={2} />
          Redes sociais
        </span>
      </div>

      <nav className="social-links" aria-label="Redes sociais">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label={social.label}
            title={social.label}
            onClick={() =>
              trackEvent('click_social', {
                social_network: social.label,
                link_url: social.href,
              })
            }
          >
            {social.icon}
          </a>
        ))}
      </nav>
    </section>
  );
}
