import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, Youtube, ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { brandLinks } from '../data/site';

interface YouTubeVideo {
  id: string;
  platform: 'YouTube';
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  accent?: string;
  thumbnailUrl?: string;
  fallbackThumbnailUrl?: string;
}

interface YouTubeData {
  generatedAt: string | null;
  videos: YouTubeVideo[];
}

export default function YouTubeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('./data/youtube.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`YouTube data request failed: ${response.status}`);
        return response.json() as Promise<YouTubeData>;
      })
      .then((data) => {
        setVideos(data.videos);
        setLoadFailed(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLoadFailed(true);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.youtube-tag',
        { y: 6 },
        { y: 0, duration: 0.35, ease: 'power3.out', delay: 0.45 }
      );

      gsap.fromTo(
        '.youtube-carousel',
        { y: 10 },
        { y: 0, duration: 0.4, ease: 'power3.out', delay: 0.5 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section ref={sectionRef} className="w-full pt-5 pb-1">
      <div className="flex items-center justify-between px-4 mb-3">
        <span className="section-tag youtube-tag">
          <Youtube size={11} strokeWidth={2} />
          Últimos Vídeos
        </span>

        <div className="flex gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: canScrollLeft
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: canScrollLeft ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
              cursor: canScrollLeft ? 'pointer' : 'default',
            }}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: canScrollRight
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: canScrollRight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
              cursor: canScrollRight ? 'pointer' : 'default',
            }}
            disabled={!canScrollRight}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="youtube-carousel flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onScroll={updateScrollState}
      >
        {videos.length === 0 && (
          <a
            href={brandLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-5 text-xs no-underline"
            style={{
              color: 'rgba(255,255,255,0.65)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <ExternalLink size={14} />
            {loadFailed ? 'Não foi possível carregar os vídeos. Ver canal' : 'Ver canal no YouTube'}
          </a>
        )}
        {videos.map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 group cursor-pointer no-underline"
            style={{ width: '200px' }}
          >
            {/* Thumbnail */}
            <div
              className="relative rounded-xl overflow-hidden mb-2"
              style={{
                aspectRatio: '16/9',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <img
                src={video.thumbnailUrl || video.fallbackThumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const image = e.currentTarget;
                  if (video.fallbackThumbnailUrl && image.src !== video.fallbackThumbnailUrl) {
                    image.src = video.fallbackThumbnailUrl;
                  } else {
                    image.style.display = 'none';
                  }
                }}
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,0,0,0.85)' }}
                >
                  <Play size={16} fill="white" strokeWidth={0} className="text-white ml-0.5" />
                </div>
              </div>
            </div>

            {/* Title */}
            <p
              className="text-[12px] font-medium leading-snug line-clamp-2 group-hover:text-[#ff6b35] transition-colors duration-200"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {video.title}
            </p>

            {/* Date */}
            {video.publishedAt && (
              <div
                className="flex items-center gap-1 mt-1"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                <Clock size={10} />
                <span className="text-[10px]">
                  {new Date(video.publishedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
