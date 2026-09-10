// components/PlatformLink.tsx
import Image from 'next/image';
import Link from 'next/link';
import { IconExternalLink } from '@tabler/icons-react';

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
  // Added for the new StreamingPlatform enum values — these file paths are
  // guesses following your existing naming convention. The actual SVG
  // assets need to be dropped into /public with these exact filenames (or
  // update the src paths to match whatever you actually save them as).
  deezer: { src: '/deezer-svgrepo-com.svg', alt: 'Deezer' },
  tidal: { src: '/tidal-logo-svgrepo-com.svg', alt: 'Tidal' },
  bandcamp: { src: '/bandcamp-svgrepo-com.svg', alt: 'Bandcamp' },
  amazonmusic: { src: '/amazon-music-svgrepo-com.svg', alt: 'Amazon Music' },
};

interface PlatformLinkProps {
  platform: string;
  url: string;
}

export function AlbumPlatformLink({ platform, url }: PlatformLinkProps) {
  const icon = PLATFORM_ICONS[normalize(platform)];

  // OTHER (or any future enum value that isn't in the table above and
  // isn't literally "other") gets a generic external-link icon instead of
  // silently disappearing — previously any unmapped platform just
  // returned null with no visual trace.
  if (!icon) {
    return (
      <Link
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Listen'
        className='opacity-70 hover:opacity-100 transition-opacity'
      >
        <IconExternalLink size={20} />
      </Link>
    );
  }

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
