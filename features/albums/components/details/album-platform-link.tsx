// components/PlatformLink.tsx
import Image from 'next/image';
import Link from 'next/link';

function normalize(platform: string) {
  return platform.toLowerCase().replace(/[^a-z]/g, '');
}

const PLATFORM_ICONS: Record<string, { src: string; alt: string }> = {
  spotify: { src: '/spotify-color-svgrepo-com.svg', alt: 'Spotify' },
  applemusic: { src: '/apple-music-svgrepo-com.svg', alt: 'Apple Music' },
  soundcloud: { src: '/soundcloud-svgrepo-com.svg', alt: 'SoundCloud' },
  youtubemusic: {
    src: '/youtube-music-song-multimedia-audio-svgrepo-com.svg',
    alt: 'YouTube Music',
  },
};

interface PlatformLinkProps {
  platform: string;
  url: string;
}

export function AlbumPlatformLink({ platform, url }: PlatformLinkProps) {
  const icon = PLATFORM_ICONS[normalize(platform)];
  if (!icon) return null;

  return (
    <Link
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={`Listen on ${icon.alt}`}
      className='opacity-70 hover:opacity-100 transition-opacity'
    >
      <Image src={icon.src} alt={icon.alt} width={20} height={20} />
    </Link>
  );
}
