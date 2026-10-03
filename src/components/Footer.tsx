import { brandLinks } from '../data/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        Feito com <span className="site-footer-heart">♥</span> por{' '}
        <a href={brandLinks.instagram} target="_blank" rel="noopener noreferrer">
          @emcasacomcecilia
        </a>
      </p>
    </footer>
  );
}
