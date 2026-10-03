import { useEffect } from 'react';
import gsap from 'gsap';
import Header from './components/Header';
import MainLinks from './components/MainLinks';
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

      const timeline = gsap.timeline({ delay: 2, repeat: 2, repeatDelay: 10 });
      timeline
        .to('.coupon-card', {
          ...breathe,
          stagger: 0.18,
        })
        .to('.attention-whatsapp', breathe, '+=1.6')
        .to('.attention-site', breathe, '+=0.45');
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="site">
      <main className="min-h-screen pb-8">
        <div className="cecilia-top">
          <div className="page-column">
            <Header />
            <CouponSection />
          </div>
        </div>
        <div className="page-column page-body">
          <MainLinks />
          <PromoFeed />
          <YouTubeSection />
          <SocialLinks />
          <MediaKit />
          <Footer />
        </div>
      </main>
    </div>
  );
}
