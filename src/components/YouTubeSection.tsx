import { useEffect, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { brandLinks } from '../data/site';
import { trackEvent } from '../lib/analytics';
import { useCarousel } from '../lib/useCarousel';
import CarouselArrows from './CarouselArrows';

interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  url: string;
  thumbnailUrl?: string;
  fallbackThumbnailUrl?: string;
}

interface YouTubeData {
  generatedAt: string | null;
  videos: YouTubeVideo[];
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

function VideoCard({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="video-card"
      onClick={() => trackEvent('click_video', { video_id: video.id, video_title: video.title })}
    >
      <span className="video-thumb">
        <img
          src={video.thumbnailUrl || video.fallbackThumbnailUrl}
          alt=""
          loading="lazy"
          onError={(event) => {
            const image = event.currentTarget;
            if (video.fallbackThumbnailUrl && image.src !== video.fallbackThumbnailUrl) {
              image.src = video.fallbackThumbnailUrl;
            } else {
              image.style.visibility = 'hidden';
            }
          }}
        />
        <span className="video-play" aria-hidden="true">
          <Play size={13} fill="currentColor" strokeWidth={0} />
        </span>
      </span>
      <span className="video-title">{video.title}</span>
      {video.publishedAt && (
        <time className="video-date" dateTime={video.publishedAt}>
          {formatDate(video.publishedAt)}
        </time>
      )}
    </a>
  );
}

export default function YouTubeSection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const { scrollerRef, atStart, atEnd, scroll } = useCarousel<HTMLDivElement>(352);

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

  return (
    <section className="carousel-section" aria-labelledby="videos-title">
      <div className="section-head">
        <h2 id="videos-title">Vídeos novos</h2>
        <CarouselArrows
          atStart={atStart}
          atEnd={atEnd}
          onScroll={scroll}
          previousLabel="Ver vídeos anteriores"
          nextLabel="Ver próximos vídeos"
        />
      </div>

      {videos.length === 0 ? (
        <a href={brandLinks.youtube} target="_blank" rel="noopener noreferrer" className="carousel-empty">
          {loadFailed ? 'Não deu para carregar os vídeos agora. Ver o canal' : 'Ver o canal no YouTube'}
          <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </a>
      ) : (
        <div ref={scrollerRef} className="carousel">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
          <a
            href={brandLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="carousel-more carousel-more--video"
            onClick={() => trackEvent('click_social', { social_network: 'YouTube', link_url: brandLinks.youtube })}
          >
            Ver o canal
            <ArrowUpRight size={20} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
      )}
    </section>
  );
}
