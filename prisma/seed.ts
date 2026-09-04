import 'dotenv/config';
import { hashPassword } from 'better-auth/crypto';
import { prisma } from '../lib/prisma';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const DAY_MS = 24 * 60 * 60 * 1000;

async function main() {
  // -------------------------------------------------------------------
  // Wipe, in dependency order (children before parents)
  // -------------------------------------------------------------------
  await prisma.comment.deleteMany();
  await prisma.trackRating.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.albumSocialLink.deleteMany();
  await prisma.track.deleteMany();
  await prisma.albumGenre.deleteMany();
  await prisma.artistGenre.deleteMany();
  await prisma.albumArtist.deleteMany();
  await prisma.rotationAlbum.deleteMany();
  await prisma.rotation.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.album.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // -------------------------------------------------------------------
  // Genres
  // -------------------------------------------------------------------
  const GENRE_NAMES = [
    'Hyperpop',
    'Shoegaze',
    'Synthpop',
    'Electronica',
    'Post-rock',
    'Indie Folk',
    'Dream Pop',
    'Ambient',
    'Chillwave',
    'Neo-soul',
    'Alternative Rock',
    'Experimental',
    'Electropop',
    'Synthwave',
    'Indie Pop',
    'Chamber Pop',
    'Trip Hop',
    'Future Bass',
    'Jazz Fusion',
    'Post-punk',
    'Art Pop',
  ];

  const genreMap = new Map<string, string>(); // name -> id
  for (const name of GENRE_NAMES) {
    const genre = await prisma.genre.create({
      data: { name, slug: slugify(name) },
    });
    genreMap.set(name, genre.id);
  }

  // -------------------------------------------------------------------
  // Users
  // -------------------------------------------------------------------
  const SEED_PASSWORD = 'password123';
  const hashedPassword = await hashPassword(SEED_PASSWORD);

  const userSeedData = [
    {
      email: 'alex@example.com',
      username: 'alex',
      name: 'Alex Chen',
      role: 'admin',
    },
    {
      email: 'maya@example.com',
      username: 'maya',
      name: 'Maya Ortiz',
      role: 'moderator',
    },
    {
      email: 'noah@example.com',
      username: 'noah',
      name: 'Noah Brooks',
      role: 'user',
    },
    {
      email: 'zoe@example.com',
      username: 'zoe',
      name: 'Zoe Kim',
      role: 'user',
    },
  ];

  const users = await Promise.all(
    userSeedData.map(async userData => {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          name: userData.name,
          role: userData.role,
          emailVerified: true,
        },
      });

      await prisma.account.create({
        data: {
          accountId: user.id,
          providerId: 'credential',
          userId: user.id,
          password: hashedPassword,
        },
      });

      return user;
    })
  );
  const [alex, maya, noah] = users;
  const ratingPool = [alex, maya, noah]; // zoe stays unrated for admin-testing purposes

  // -------------------------------------------------------------------
  // Artists
  // -------------------------------------------------------------------
  const artistNames = [
    'Jane Remover',
    'venturing',
    'leroy',
    'Aria Leaf',
    'Nova Pulse',
    'Cinder Fields',
    'Sable & Shore',
    'Paper Coast',
    'Hollow Rain',
    'Zephyr Echo',
    'Little Winter',
    'Mythic City',
    'Silver Hymn',
  ];

  const artists = await Promise.all(
    artistNames.map(name =>
      prisma.artist.create({
        data: { name, slug: slugify(name) },
      })
    )
  );

  // -------------------------------------------------------------------
  // Albums
  // -------------------------------------------------------------------
  // rotationGroup marks which seeded Rotation this album belongs to.
  // 'A' | 'B' | 'C' = past, closed rotations. 'D' = the current, open one.
  const albumSeedData = [
    {
      title: 'Revengeseekerz',
      slug: 'revengeseekerz',
      releaseYear: 2025,
      genre: 'Hyperpop',
      artistId: artists[0].id,
      rotationGroup: 'D',
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
      releaseYear: 2025,
      genre: 'Shoegaze',
      artistId: artists[0].id,
      rotationGroup: 'A',
      socialLinks: [
        { platform: 'Spotify', url: 'https://open.spotify.com/album/heart' },
      ],
      tracks: ['Angels In Camo', 'TWICE REMOVED', 'JRJRJR'],
    },
    {
      title: 'Ghostholding',
      slug: 'ghostholding',
      releaseYear: 2025,
      genre: 'Shoegaze',
      artistId: artists[1].id,
      rotationGroup: 'D',
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
      releaseYear: 2024,
      genre: 'Synthpop',
      artistId: artists[3].id,
      rotationGroup: 'D',
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
      releaseYear: 2023,
      genre: 'Electronica',
      artistId: artists[4].id,
      rotationGroup: 'A',
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
      releaseYear: 2018,
      genre: 'Post-rock',
      artistId: artists[5].id,
      rotationGroup: 'A',
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
      releaseYear: 2022,
      genre: 'Indie Folk',
      artistId: artists[6].id,
      rotationGroup: 'A',
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
      releaseYear: 2021,
      genre: 'Dream Pop',
      artistId: artists[7].id,
      rotationGroup: 'A',
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
      releaseYear: 2019,
      genre: 'Ambient',
      artistId: artists[8].id,
      rotationGroup: 'A',
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
      releaseYear: 2025,
      genre: 'Chillwave',
      artistId: artists[9].id,
      rotationGroup: 'D',
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/zephyr-echoes',
        },
      ],
      tracks: ['Aura', 'Softwind', 'Mirage', 'Daydream Coast'],
    },
    {
      title: 'Winter\u2019s Signal',
      slug: 'winters-signal',
      releaseYear: 2020,
      genre: 'Neo-soul',
      artistId: artists[10].id,
      rotationGroup: 'B',
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
      releaseYear: 2017,
      genre: 'Alternative Rock',
      artistId: artists[11].id,
      rotationGroup: 'B',
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
      releaseYear: 2026,
      genre: 'Experimental',
      artistId: artists[12].id,
      rotationGroup: 'D',
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
      releaseYear: 2022,
      genre: 'Electropop',
      artistId: artists[3].id,
      rotationGroup: 'B',
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
      releaseYear: 2021,
      genre: 'Synthwave',
      artistId: artists[4].id,
      rotationGroup: 'B',
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
      releaseYear: 2024,
      genre: 'Shoegaze',
      artistId: artists[5].id,
      rotationGroup: 'D',
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
      releaseYear: 2023,
      genre: 'Indie Pop',
      artistId: artists[6].id,
      rotationGroup: 'B',
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
      releaseYear: 2016,
      genre: 'Chamber Pop',
      artistId: artists[7].id,
      rotationGroup: 'C',
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
      releaseYear: 2020,
      genre: 'Trip Hop',
      artistId: artists[8].id,
      rotationGroup: 'C',
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
      releaseYear: 2019,
      genre: 'Future Bass',
      artistId: artists[9].id,
      rotationGroup: 'C',
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
      releaseYear: 2021,
      genre: 'Jazz Fusion',
      artistId: artists[10].id,
      rotationGroup: 'C',
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
      releaseYear: 2024,
      genre: 'Post-punk',
      artistId: artists[11].id,
      rotationGroup: 'D',
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
      releaseYear: 2018,
      genre: 'Art Pop',
      artistId: artists[12].id,
      rotationGroup: 'C',
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
  ] as const;

  const albumsBySlug = new Map<
    string,
    Awaited<ReturnType<typeof prisma.album.create>> & {
      tracks: { id: string; title: string }[];
    }
  >();

  for (const seed of albumSeedData) {
    const album = await prisma.album.create({
      data: {
        title: seed.title,
        slug: seed.slug,
        releaseDate: new Date(seed.releaseYear, 0, 1),
        genres: {
          create: [{ genre: { connect: { id: genreMap.get(seed.genre)! } } }],
        },
        socialLinks: { create: [...seed.socialLinks] },
        artists: { create: { artist: { connect: { id: seed.artistId } } } },
        tracks: {
          create: seed.tracks.map((title, index) => ({
            title,
            number: index + 1,
          })),
        },
      },
      include: { tracks: true },
    });
    albumsBySlug.set(seed.slug, album);
  }

  // -------------------------------------------------------------------
  // Rotations
  //
  // A, B, C = past, closed rotations (with scored, public snapshots).
  // "Paper Coast" is deliberately placed in both A and C to demonstrate
  // an album returning to rotation and building up score history.
  // D = the current, open rotation (unclosed, partially rated).
  // -------------------------------------------------------------------
  const now = new Date();

  const rotationA = await prisma.rotation.create({
    data: {
      name: '#1 week - dream pop & ambient',
      slug: 'week-1-dream-pop-ambient',
      startDate: new Date(now.getTime() - 21 * DAY_MS),
      endDate: new Date(now.getTime() - 14 * DAY_MS),
    },
  });
  const rotationB = await prisma.rotation.create({
    data: {
      name: '#2 week - deep cuts',
      slug: 'week-2-deep-cuts',
      startDate: new Date(now.getTime() - 14 * DAY_MS),
      endDate: new Date(now.getTime() - 7 * DAY_MS),
    },
  });
  const rotationC = await prisma.rotation.create({
    data: {
      name: '#3 week - throwbacks & returns',
      slug: 'week-3-throwbacks-returns',
      startDate: new Date(now.getTime() - 7 * DAY_MS),
      endDate: new Date(now.getTime() - 1 * DAY_MS),
    },
  });
  const rotationD = await prisma.rotation.create({
    data: {
      name: '#4 week - fresh drops',
      slug: 'week-4-fresh-drops',
      startDate: new Date(now.getTime() - 2 * DAY_MS),
      endDate: new Date(now.getTime() + 5 * DAY_MS),
    },
  });

  const rotationAAlbums = [
    'heart',
    'echo-atlas',
    'stormchaser',
    'shoreline-letters',
    'paper-coast',
    'rain-on-concrete',
  ];
  const rotationBAlbums = [
    'winters-signal',
    'city-of-myths',
    'midnight-sunrise',
    'glass-horizon',
    'salt-and-static',
  ];
  const rotationCAlbums = [
    'origami-sea',
    'velvet-ash',
    'neon-orchard',
    'moonlit-compass',
    'glass-cathedral',
    'paper-coast',
  ];
  const rotationDAlbums = [
    'revengeseekerz',
    'ghostholding',
    'nightshade-arcade',
    'zephyr-echoes',
    'silver-hymn',
    'crimson-drift',
    'skyline-ruins',
  ];

  // Seeds ratings + a RotationAlbum row for one album in a closed rotation,
  // then snapshots the average/count onto RotationAlbum and mirrors it onto
  // Album (last rotation processed for a given album "wins" the mirror,
  // since we process A -> B -> C -> D in chronological order).
  async function seedClosedRotationAlbum(
    rotationId: string,
    rotationEnd: Date,
    rotationStart: Date,
    albumSlug: string
  ) {
    const album = albumsBySlug.get(albumSlug)!;

    await prisma.rotationAlbum.create({
      data: { rotationId, albumId: album.id },
    });

    const windowSpan = rotationEnd.getTime() - rotationStart.getTime();
    const scores: number[] = [];

    for (let i = 0; i < ratingPool.length; i++) {
      const user = ratingPool[i];
      const score = 60 + ((i * 7 + album.title.length * 3) % 35); // deterministic spread, 60-94
      scores.push(score);
      const ratedAt = new Date(
        rotationStart.getTime() +
          (windowSpan * (i + 1)) / (ratingPool.length + 1)
      );

      const rating = await prisma.rating.create({
        data: {
          userId: user.id,
          albumId: album.id,
          rotationId,
          score,
          ratedAt,
        },
      });

      if (user.id === alex.id) {
        await prisma.comment.create({
          data: {
            body: `A strong listen for ${album.title}.`,
            authorId: user.id,
            ratingId: rating.id,
          },
        });
      }
    }

    const averageRating = Math.round(
      scores.reduce((sum, s) => sum + s, 0) / scores.length
    );
    const ratingCount = scores.length;

    await prisma.rotationAlbum.update({
      where: { rotationId_albumId: { rotationId, albumId: album.id } },
      data: { averageRating, ratingCount, closedAt: rotationEnd },
    });
    await prisma.album.update({
      where: { id: album.id },
      data: { averageRating, ratingCount },
    });

    await seedTrackRatingsOnce(album);
  }

  // Track ratings aren't rotation-scoped, so an album that appears in
  // multiple rotations (e.g. "Paper Coast" in A and C) must only get its
  // tracks rated once, not once per appearance.
  const trackRatedAlbumIds = new Set<string>();
  async function seedTrackRatingsOnce(album: {
    id: string;
    title: string;
    tracks: { id: string; title: string }[];
  }) {
    if (trackRatedAlbumIds.has(album.id)) return;
    trackRatedAlbumIds.add(album.id);

    for (let i = 0; i < ratingPool.length; i++) {
      const user = ratingPool[i];
      for (let t = 0; t < album.tracks.length; t++) {
        const track = album.tracks[t];
        const score = 60 + ((i * 5 + t * 4) % 35);
        const trackRating = await prisma.trackRating.create({
          data: { userId: user.id, trackId: track.id, score },
        });

        if (user.id === alex.id && t === 0) {
          await prisma.comment.create({
            data: {
              body: `"${track.title}" is a great opener.`,
              authorId: user.id,
              trackRatingId: trackRating.id,
            },
          });
        }
      }
    }
  }

  for (const slug of rotationAAlbums) {
    await seedClosedRotationAlbum(
      rotationA.id,
      rotationA.endDate,
      rotationA.startDate,
      slug
    );
  }
  for (const slug of rotationBAlbums) {
    await seedClosedRotationAlbum(
      rotationB.id,
      rotationB.endDate,
      rotationB.startDate,
      slug
    );
  }
  for (const slug of rotationCAlbums) {
    await seedClosedRotationAlbum(
      rotationC.id,
      rotationC.endDate,
      rotationC.startDate,
      slug
    );
  }

  // Current, open rotation: RotationAlbum rows exist but stay unclosed
  // (averageRating/ratingCount/closedAt all null). A couple of albums get
  // partial, in-progress ratings to simulate a week actively in motion —
  // these are NOT public yet and Album.averageRating is left untouched.
  for (const slug of rotationDAlbums) {
    const album = albumsBySlug.get(slug)!;
    await prisma.rotationAlbum.create({
      data: { rotationId: rotationD.id, albumId: album.id },
    });
    await seedTrackRatingsOnce(album);
  }

  await prisma.rating.create({
    data: {
      userId: alex.id,
      albumId: albumsBySlug.get('revengeseekerz')!.id,
      rotationId: rotationD.id,
      score: 88,
      ratedAt: now,
    },
  });
  await prisma.rating.create({
    data: {
      userId: maya.id,
      albumId: albumsBySlug.get('revengeseekerz')!.id,
      rotationId: rotationD.id,
      score: 82,
      ratedAt: now,
    },
  });
  await prisma.rating.create({
    data: {
      userId: alex.id,
      albumId: albumsBySlug.get('ghostholding')!.id,
      rotationId: rotationD.id,
      score: 75,
      ratedAt: now,
    },
  });

  console.log('Seed completed successfully.');
  console.log(`Test login for any seeded user: <email> / ${SEED_PASSWORD}`);
  console.log('  alex@example.com  -> admin');
  console.log('  maya@example.com  -> moderator');
  console.log('  noah@example.com  -> user');
  console.log(
    '  zoe@example.com   -> user (unrated, useful for testing empty states)'
  );
  console.log(
    'Rotations seeded: A/B/C closed with public scores, D currently open.'
  );
  console.log(
    '"Paper Coast" appears in both rotation A and C to demo score history.'
  );
  console.log(
    'All image fields are placeholder URLs — swap for real Cloudinary URLs later.'
  );
}

main()
  .catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
