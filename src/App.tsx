import Header from './components/Header';
import BentoGrid from './components/BentoGrid';
import PromoFeed from './components/PromoFeed';
import CouponSection from './components/CouponSection';
import YouTubeSection from './components/YouTubeSection';
import SocialLinks from './components/SocialLinks';
import MediaKit from './components/MediaKit';
import Footer from './components/Footer';

export default function App() {
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
