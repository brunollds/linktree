import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { y: 6 },
        { y: 0, duration: 0.35, ease: 'power2.out', delay: 0.7 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="flex flex-col items-center py-5 mt-1">
      <p
        className="text-[10px]"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        Feito com <span style={{ color: '#ff6b35' }}>&hearts;</span> por{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #1a4d2e, #ff6b35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 600,
          }}
        >
          @emcasacomcecilia
        </span>
      </p>
    </footer>
  );
}
