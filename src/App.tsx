import { useEffect } from 'react';
import gsap from 'gsap';
import Header from './components/Header';
import BentoGrid from './components/BentoGrid';
import PromoFeed from './components/PromoFeed';
import CouponSection from './components/CouponSection';
import YouTubeSection from './components/YouTubeSection';
import SocialLinks from './components/SocialLinks';
import MediaKit from './components/MediaKit';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const breathe = {
        scale: 1.025,
        duration: 0.46,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      };

      const timeline = gsap.timeline({ delay: 2 });
      timeline
        .to('.coupon-card', {
          ...breathe,
          stagger: 0.18,
        })
        .to('.attention-whatsapp', breathe, '+=1.6')
        .to('.attention-site', breathe, '+=0.45');

      gsap.delayedCall(22, () => {
        gsap.to('.attention-whatsapp', breathe);
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="paper-theme">
      <main className="relative z-10 min-h-screen flex flex-col items-center px-3 pb-8">
        <Header />
        <CouponSection />
        <PromoFeed />
        <BentoGrid />
        <YouTubeSection />
        <SocialLinks />
        <MediaKit />
        <Footer />
      </main>
    </div>
  );
}
