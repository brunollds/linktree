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
  { href: brandLinks.instagram, icon: <FaInstagram />, label: 'Instagram' },
  { href: brandLinks.youtube, icon: <FaYoutube />, label: 'YouTube' },
  { href: brandLinks.tiktok, icon: <FaTiktok />, label: 'TikTok' },
  { href: brandLinks.facebook, icon: <FaFacebookF />, label: 'Facebook' },
  { href: brandLinks.kwai, icon: <SiKuaishou />, label: 'Kwai' },
  { href: brandLinks.x, icon: <FaXTwitter />, label: 'X' },
];

export default function SocialLinks() {
  return (
    <section className="page-section" aria-labelledby="redes-title">
      <div className="section-head">
        <h2 id="redes-title">Me acompanhe</h2>
      </div>

      <nav className="social-links" aria-label="Redes sociais">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label={`${social.label} do Em Casa com Cecília`}
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
