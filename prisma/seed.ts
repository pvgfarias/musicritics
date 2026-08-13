import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  await prisma.comment.deleteMany();
  await prisma.trackRating.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.albumSocialLink.deleteMany();
  await prisma.track.deleteMany();
  await prisma.albumArtist.deleteMany();
  await prisma.album.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alex@example.com',
        username: 'alex',
        name: 'Alex Chen',
        image: 'user.jpg',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maya@example.com',
        username: 'maya',
        name: 'Maya Ortiz',
        image: 'user.jpg',
      },
    }),
    prisma.user.create({
      data: {
        email: 'noah@example.com',
        username: 'noah',
        name: 'Noah Brooks',
        image: 'user.jpg',
      },
    }),
    prisma.user.create({
      data: {
        email: 'zoe@example.com',
        username: 'zoe',
        name: 'Zoe Kim',
        image: 'user.jpg',
      },
    }),
  ]);

  const artists = await Promise.all([
    prisma.artist.create({
      data: {
        name: 'Jane Remover',
        slug: 'jane-remover',
        image: 'jr.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'venturing',
        slug: 'venturing',
        image: 'venturing.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'leroy',
        slug: 'leroy',
        image: 'leroy.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Aria Leaf',
        slug: 'aria-leaf',
        image: 'aria-leaf.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Nova Pulse',
        slug: 'nova-pulse',
        image: 'nova-pulse.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Cinder Fields',
        slug: 'cinder-fields',
        image: 'cinder-fields.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Sable & Shore',
        slug: 'sable-and-shore',
        image: 'sable-and-shore.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Paper Coast',
        slug: 'paper-coast',
        image: 'paper-coast.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Hollow Rain',
        slug: 'hollow-rain',
        image: 'hollow-rain.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Zephyr Echo',
        slug: 'zephyr-echo',
        image: 'zephyr-echo.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Little Winter',
        slug: 'little-winter',
        image: 'little-winter.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Mythic City',
        slug: 'mythic-city',
        image: 'mythic-city.jpg',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Silver Hymn',
        slug: 'silver-hymn',
        image: 'silver-hymn.jpg',
      },
    }),
  ]);

  const albums = [];

  const albumSeedData = [
    {
      title: 'Revengeseekerz',
      slug: 'revengeseekerz',
      coverImage: 'revengeseekerz.jpg',
      releaseYear: 2025,
      genre: 'Hyperpop',
      artistId: artists[0].id,
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/revengeseekerz',
        },
        {
          platform: 'Apple Music',
          url: 'https://music.apple.com/album/revengeseekerz',
        },
      ],
      tracks: [
        'TWICE REMOVED',
        'Psychoboost',
        'Star People',
        'Experimental Skin',
        'angels in camo',
      ],
    },
    {
      title: '♡',
      slug: 'heart',
      coverImage: 'heart.jpg',
      releaseYear: 2025,
      genre: 'Shoegaze',
      artistId: artists[0].id,
      socialLinks: [
        { platform: 'Spotify', url: 'https://open.spotify.com/album/heart' },
      ],
      tracks: ['Angels In Camo', 'TWICE REMOVED', 'JRJRJR'],
    },
    {
      title: 'Ghostholding',
      slug: 'ghostholding',
      coverImage: 'ghostholding.jpg',
      releaseYear: 2025,
      genre: 'Shoegaze',
      artistId: artists[1].id,
      socialLinks: [
        {
          platform: 'Bandcamp',
          url: 'https://venturing.bandcamp.com/album/ghostholding',
        },
      ],
      tracks: ['Ghosthold', 'Afterglow', 'Static Bloom'],
    },
    {
      title: 'Nightshade Arcade',
      slug: 'nightshade-arcade',
      coverImage: 'nightshade-arcade.jpg',
      releaseYear: 2024,
      genre: 'Synthpop',
      artistId: artists[3].id,
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/nightshade-arcade',
        },
      ],
      tracks: [
        'Pulse',
        'Neon Petals',
        'Afterglow',
        'Glass Wings',
        'Midnight Drive',
      ],
    },
    {
      title: 'Echo Atlas',
      slug: 'echo-atlas',
      coverImage: 'echo-atlas.jpg',
      releaseYear: 2023,
      genre: 'Electronica',
      artistId: artists[4].id,
      socialLinks: [
        {
          platform: 'Apple Music',
          url: 'https://music.apple.com/album/echo-atlas',
        },
      ],
      tracks: ['Atlas', 'Orbit', 'Translucent', 'Pulse Rift', 'Skyline'],
    },
    {
      title: 'Stormchaser',
      slug: 'stormchaser',
      coverImage: 'stormchaser.jpg',
      releaseYear: 2018,
      genre: 'Post-rock',
      artistId: artists[5].id,
      socialLinks: [
        {
          platform: 'Bandcamp',
          url: 'https://cinderfields.bandcamp.com/album/stormchaser',
        },
      ],
      tracks: [
        'Thunder Road',
        'Salt and Stone',
        'Signal Fires',
        'After the Fall',
      ],
    },
    {
      title: 'Shoreline Letters',
      slug: 'shoreline-letters',
      coverImage: 'shoreline-letters.jpg',
      releaseYear: 2022,
      genre: 'Indie Folk',
      artistId: artists[6].id,
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/shoreline-letters',
        },
      ],
      tracks: ['Paper Boats', 'High Tide', 'Postcard Sound', 'Blue Lantern'],
    },
    {
      title: 'Paper Coast',
      slug: 'paper-coast',
      coverImage: 'paper-coast.jpg',
      releaseYear: 2021,
      genre: 'Dream Pop',
      artistId: artists[7].id,
      socialLinks: [
        {
          platform: 'Apple Music',
          url: 'https://music.apple.com/album/paper-coast',
        },
      ],
      tracks: ['Folded Shore', 'Ink and Sea', 'Static Tide', 'The Quiet Fold'],
    },
    {
      title: 'Rain on Concrete',
      slug: 'rain-on-concrete',
      coverImage: 'rain-on-concrete.jpg',
      releaseYear: 2019,
      genre: 'Ambient',
      artistId: artists[8].id,
      socialLinks: [
        {
          platform: 'Bandcamp',
          url: 'https://hollowrain.bandcamp.com/album/rain-on-concrete',
        },
      ],
      tracks: ['City Drizzle', 'Underpass', 'Neon Puddles', 'Static Silence'],
    },
    {
      title: 'Zephyr Echoes',
      slug: 'zephyr-echoes',
      coverImage: 'zephyr-echoes.jpg',
      releaseYear: 2025,
      genre: 'Chillwave',
      artistId: artists[9].id,
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/zephyr-echoes',
        },
      ],
      tracks: ['Aura', 'Softwind', 'Mirage', 'Daydream Coast'],
    },
    {
      title: 'Winter’s Signal',
      slug: 'winters-signal',
      coverImage: 'winters-signal.jpg',
      releaseYear: 2020,
      genre: 'Neo-soul',
      artistId: artists[10].id,
      socialLinks: [
        {
          platform: 'Apple Music',
          url: 'https://music.apple.com/album/winters-signal',
        },
      ],
      tracks: ['Northern Sky', 'Warmth', 'Signal Light', 'Snowfall Piano'],
    },
    {
      title: 'City of Myths',
      slug: 'city-of-myths',
      coverImage: 'city-of-myths.jpg',
      releaseYear: 2017,
      genre: 'Alternative Rock',
      artistId: artists[11].id,
      socialLinks: [
        {
          platform: 'Bandcamp',
          url: 'https://mythiccity.bandcamp.com/album/city-of-myths',
        },
      ],
      tracks: [
        'Neon Gods',
        'Back Alley Hymn',
        'Rooftop Silence',
        'Tower Light',
      ],
    },
    {
      title: 'Silver Hymn',
      slug: 'silver-hymn',
      coverImage: 'silver-hymn.jpg',
      releaseYear: 2026,
      genre: 'Experimental',
      artistId: artists[12].id,
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/silver-hymn',
        },
      ],
      tracks: ['Glass Chimes', 'Photon Drift', 'Resonant Skin', 'Mirror Pulse'],
    },
    {
      title: 'Midnight Sunrise',
      slug: 'midnight-sunrise',
      coverImage: 'midnight-sunrise.jpg',
      releaseYear: 2022,
      genre: 'Electropop',
      artistId: artists[3].id,
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/midnight-sunrise',
        },
      ],
      tracks: ['Neon Dawn', 'Velvet Hour', 'City Lights', 'Sundown'],
    },
    {
      title: 'Glass Horizon',
      slug: 'glass-horizon',
      coverImage: 'glass-horizon.jpg',
      releaseYear: 2021,
      genre: 'Synthwave',
      artistId: artists[4].id,
      socialLinks: [
        {
          platform: 'Apple Music',
          url: 'https://music.apple.com/album/glass-horizon',
        },
      ],
      tracks: ['Pulse Night', 'Horizon Drive', 'Afterglow', 'Neon Mirage'],
    },
    {
      title: 'Crimson Drift',
      slug: 'crimson-drift',
      coverImage: 'crimson-drift.jpg',
      releaseYear: 2024,
      genre: 'Shoegaze',
      artistId: artists[5].id,
      socialLinks: [
        {
          platform: 'Bandcamp',
          url: 'https://cinderfields.bandcamp.com/album/crimson-drift',
        },
      ],
      tracks: ['Dissolve', 'Red Tide', 'Faded Signal', 'Soft Burn'],
    },
    {
      title: 'Salt & Static',
      slug: 'salt-and-static',
      coverImage: 'salt-and-static.jpg',
      releaseYear: 2023,
      genre: 'Indie Pop',
      artistId: artists[6].id,
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/salt-and-static',
        },
      ],
      tracks: ['Paper Boat', 'Tidal Loop', 'Static', 'Quiet Storm'],
    },
    {
      title: 'Origami Sea',
      slug: 'origami-sea',
      coverImage: 'origami-sea.jpg',
      releaseYear: 2016,
      genre: 'Chamber Pop',
      artistId: artists[7].id,
      socialLinks: [
        {
          platform: 'Apple Music',
          url: 'https://music.apple.com/album/origami-sea',
        },
      ],
      tracks: ['Quiet Fold', 'Paper Wave', 'Ink Bloom', 'Margin Light'],
    },
    {
      title: 'Velvet Ash',
      slug: 'velvet-ash',
      coverImage: 'velvet-ash.jpg',
      releaseYear: 2020,
      genre: 'Trip Hop',
      artistId: artists[8].id,
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/velvet-ash',
        },
      ],
      tracks: ['Ashes', 'Hollow', 'Low Glow', 'Stillness'],
    },
    {
      title: 'Neon Orchard',
      slug: 'neon-orchard',
      coverImage: 'neon-orchard.jpg',
      releaseYear: 2019,
      genre: 'Future Bass',
      artistId: artists[9].id,
      socialLinks: [
        {
          platform: 'Bandcamp',
          url: 'https://zephyrecho.bandcamp.com/album/neon-orchard',
        },
      ],
      tracks: ['Electric Bloom', 'Skyline', 'Soft Pulse', 'Radiant Fade'],
    },
    {
      title: 'Moonlit Compass',
      slug: 'moonlit-compass',
      coverImage: 'moonlit-compass.jpg',
      releaseYear: 2021,
      genre: 'Jazz Fusion',
      artistId: artists[10].id,
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/moonlit-compass',
        },
      ],
      tracks: ['North Star', 'Velvet Road', 'Luminous', 'Night Drive'],
    },
    {
      title: 'Skyline Ruins',
      slug: 'skyline-ruins',
      coverImage: 'skyline-ruins.jpg',
      releaseYear: 2024,
      genre: 'Post-punk',
      artistId: artists[11].id,
      socialLinks: [
        {
          platform: 'Apple Music',
          url: 'https://music.apple.com/album/skyline-ruins',
        },
      ],
      tracks: [
        'Concrete Ghost',
        'Broken Windows',
        'Echo Tower',
        'Signal Noise',
      ],
    },
    {
      title: 'Glass Cathedral',
      slug: 'glass-cathedral',
      coverImage: 'glass-cathedral.jpg',
      releaseYear: 2018,
      genre: 'Art Pop',
      artistId: artists[12].id,
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/glass-cathedral',
        },
      ],
      tracks: [
        'Marble Floor',
        'Chamber Light',
        'Silver Choir',
        'Crest of Sound',
      ],
    },
  ];

  for (const albumSeed of albumSeedData) {
    const album = await prisma.album.create({
      data: {
        title: albumSeed.title,
        slug: albumSeed.slug,
        coverImage: albumSeed.coverImage,
        releaseYear: albumSeed.releaseYear,
        genre: albumSeed.genre,
        socialLinks: {
          create: albumSeed.socialLinks,
        },
        artists: {
          create: {
            artist: {
              connect: { id: albumSeed.artistId },
            },
          },
        },
        tracks: {
          create: albumSeed.tracks.map((title, index) => ({
            title,
            number: index + 1,
          })),
        },
      },
      include: {
        tracks: true,
      },
    });

    albums.push(album);
  }

  for (const album of albums) {
    const albumTracks = album.tracks;
    const userPool = [users[0], users[1], users[2]];

    for (let userIndex = 0; userIndex < userPool.length; userIndex += 1) {
      const user = userPool[userIndex];
      const trackScores = albumTracks.map(
        (_, index) => 70 + ((index + userIndex * 5) % 20)
      );
      const averageScore = Math.round(
        trackScores.reduce((sum, score) => sum + score, 0) / trackScores.length
      );

      const rating = await prisma.rating.create({
        data: {
          userId: user.id,
          albumId: album.id,
          score: averageScore,
          finalized: album.title === 'Revengeseekerz' ? false : true,
        },
      });

      for (let index = 0; index < albumTracks.length; index += 1) {
        const track = albumTracks[index];
        await prisma.trackRating.create({
          data: {
            userId: user.id,
            trackId: track.id,
            score: trackScores[index],
          },
        });
      }

      if (user.id === users[0].id) {
        await prisma.comment.create({
          data: {
            body: `A strong listen for ${album.title}.`,
            authorId: user.id,
            ratingId: rating.id,
          },
        });
      }
    }
  }

  console.log('Seed completed successfully.');
}

main()
  .catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
