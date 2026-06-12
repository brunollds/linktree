import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(rootDir, 'public', 'data', 'youtube.json');

async function loadLocalEnv() {
  try {
    const content = await readFile(path.join(rootDir, '.env'), 'utf8');

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const separator = trimmed.indexOf('=');
      if (separator < 1) continue;

      const key = trimmed.slice(0, separator).trim();
      const rawValue = trimmed.slice(separator + 1).trim();
      const value = rawValue.replace(/^(['"])(.*)\1$/, '$2');

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function pickThumbnail(thumbnails) {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url
  );
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API request failed: ${response.status}`);
  }
  return response.json();
}

async function getUploadsPlaylistId(apiKey, channelId) {
  const params = new URLSearchParams({
    part: 'contentDetails',
    id: channelId,
    key: apiKey,
  });
  const data = await fetchJson(`${YOUTUBE_API_BASE}/channels?${params}`);
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
}

async function getLatestUploads(apiKey, playlistId) {
  const params = new URLSearchParams({
    part: 'snippet,contentDetails',
    maxResults: '6',
    playlistId,
    key: apiKey,
  });
  const data = await fetchJson(`${YOUTUBE_API_BASE}/playlistItems?${params}`);
  return data.items ?? [];
}

function mapPlaylistItems(items) {
  const accents = ['#ff6b35', '#ffd700', '#ffffff', '#ffcfb8', '#f8e7a4', '#dfe7ff'];

  return items
    .map((item, index) => {
      const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
      const title = item.snippet?.title?.trim();

      if (!videoId || !title || title === 'Private video' || title === 'Deleted video') {
        return null;
      }

      return {
        id: videoId,
        platform: 'YouTube',
        title,
        description: truncate(
          item.snippet?.description?.replace(/\s+/g, ' ').trim() ||
            'Assista ao vídeo no canal da Cecília.',
          90,
        ),
        publishedAt: item.snippet?.publishedAt ?? '',
        url: `https://www.youtube.com/watch?v=${videoId}`,
        accent: accents[index % accents.length],
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        fallbackThumbnailUrl: pickThumbnail(item.snippet?.thumbnails),
      };
    })
    .filter(Boolean);
}

async function main() {
  await loadLocalEnv();

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.warn('YouTube sync skipped: YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID is missing.');
    return;
  }

  const playlistId = await getUploadsPlaylistId(apiKey, channelId);
  if (!playlistId) {
    throw new Error('Uploads playlist was not found for the configured channel.');
  }

  const items = await getLatestUploads(apiKey, playlistId);
  const videos = mapPlaylistItems(items);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), videos }, null, 2)}\n`,
    'utf8',
  );

  console.log(`YouTube sync complete: ${videos.length} videos.`);
}

main().catch((error) => {
  console.warn(`YouTube sync failed; keeping the existing feed: ${error.message}`);
});
