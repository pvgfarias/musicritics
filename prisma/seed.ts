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
    'Dream Pop',
    'Neo-soul',
    'Alternative Rock',
    'Synthwave',
    'Chillwave',
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
    'Aria Leaf',
    'Nova Pulse',
    'Cinder Fields',
    'Paper Coast',
    'Little Winter',
    'Mythic City',
    'Nova Pulse Duo', // distinct from Nova Pulse to avoid slug collision
    'Zephyr Echo',
  ];

  const artists = await Promise.all(
    artistNames.map(name =>
      prisma.artist.create({
        data: { name, slug: slugify(name) },
      })
    )
  );

  // -------------------------------------------------------------------
  // Albums (10 total)
  // -------------------------------------------------------------------
  // rotationGroups marks which seeded Rotation(s) this album belongs to.
  // 'A' | 'B' | 'C' = past, closed rotations. 'D' = the current, open one.
  // 'paper-coast' intentionally lists both 'A' and 'C' — same album,
  // two separate trips through rotation — to demonstrate that its Rating
  // persists globally instead of being recreated per rotation.
  const albumSeedData = [
    {
      title: 'Revengeseekerz',
      slug: 'revengeseekerz',
      releaseYear: 2025,
      genre: 'Hyperpop',
      artistId: artists[0].id,
      rotationGroups: ['D'],
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/revengeseekerz',
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
      title: 'Ghostholding',
      slug: 'ghostholding',
      releaseYear: 2025,
      genre: 'Shoegaze',
      artistId: artists[1].id,
      rotationGroups: ['D'],
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
      artistId: artists[2].id,
      rotationGroups: ['A'],
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
      artistId: artists[3].id,
      rotationGroups: ['A'],
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
      artistId: artists[4].id,
      rotationGroups: ['A'],
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
      title: 'Paper Coast',
      slug: 'paper-coast',
      releaseYear: 2021,
      genre: 'Dream Pop',
      artistId: artists[5].id,
      rotationGroups: ['A', 'C'],
      socialLinks: [
        {
          platform: 'Apple Music',
          url: 'https://music.apple.com/album/paper-coast',
        },
      ],
      tracks: ['Folded Shore', 'Ink and Sea', 'Static Tide', 'The Quiet Fold'],
    },
    {
      title: "Winter's Signal",
      slug: 'winters-signal',
      releaseYear: 2020,
      genre: 'Neo-soul',
      artistId: artists[6].id,
      rotationGroups: ['B'],
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
      artistId: artists[7].id,
      rotationGroups: ['B'],
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
      title: 'Glass Horizon',
      slug: 'glass-horizon',
      releaseYear: 2021,
      genre: 'Synthwave',
      artistId: artists[8].id,
      rotationGroups: ['C'],
      socialLinks: [
        {
          platform: 'Apple Music',
          url: 'https://music.apple.com/album/glass-horizon',
        },
      ],
      tracks: ['Pulse Night', 'Horizon Drive', 'Afterglow', 'Neon Mirage'],
    },
    {
      title: 'Zephyr Echoes',
      slug: 'zephyr-echoes',
      releaseYear: 2025,
      genre: 'Chillwave',
      artistId: artists[9].id,
      rotationGroups: ['D'],
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/album/zephyr-echoes',
        },
      ],
      tracks: ['Aura', 'Softwind', 'Mirage', 'Daydream Coast'],
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
  // A, B, C = past, closed rotations (with public score snapshots).
  // "Paper Coast" is deliberately placed in both A and C to demonstrate
  // an album returning to rotation while its Rating (derived from track
  // ratings) stays a single, persistent row rather than being duplicated.
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
  const rotationsById = {
    A: rotationA,
    B: rotationB,
    C: rotationC,
    D: rotationD,
  } as const;

  // ---------------------------------------------------------------------
  // Track ratings drive everything. Rating (the album-level "My Score") is
  // never entered directly — it's always recomputed as the average of a
  // user's own TrackRating rows for that album, then upserted into the
  // single Rating row for (userId, albumId). This mirrors how the app
  // itself should write ratings: track scores in, album score derived.
  // ---------------------------------------------------------------------
  async function recomputeUserAlbumRating(userId: string, albumId: string) {
    const trackRatings = await prisma.trackRating.findMany({
      where: { userId, track: { albumId } },
      select: { score: true },
    });
    const scores = trackRatings
      .map(r => r.score)
      .filter((s): s is number => s != null);

    if (scores.length === 0) {
      await prisma.rating.deleteMany({ where: { userId, albumId } });
      return;
    }

    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;

    await prisma.rating.upsert({
      where: { userId_albumId: { userId, albumId } },
      create: { userId, albumId, score: avg },
      update: { score: avg, ratedAt: new Date() },
    });
  }

  // Rates every track, for every user in `users`, for a given album, then
  // recomputes each of those users' derived album Rating. Idempotent per
  // album — an album seen in multiple rotations (e.g. Paper Coast) only
  // gets its tracks rated once, not once per rotation appearance.
  const trackRatedAlbumIds = new Set<string>();
  async function seedTrackRatingsOnce(
    album: {
      id: string;
      title: string;
      tracks: { id: string; title: string }[];
    },
    ratersOverride?: typeof ratingPool
  ) {
    if (trackRatedAlbumIds.has(album.id)) return;
    trackRatedAlbumIds.add(album.id);

    const raters = ratersOverride ?? ratingPool;

    for (let i = 0; i < raters.length; i++) {
      const user = raters[i];
      for (let t = 0; t < album.tracks.length; t++) {
        const track = album.tracks[t];
        // Deterministic but varies by album AND track, unlike the old
        // formula which only varied by position and produced identical
        // scores across every album.
        const score = 60 + ((i * 5 + t * 4 + album.title.length) % 35);
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
      await recomputeUserAlbumRating(user.id, album.id);
    }
  }

  // Adds a RotationAlbum row (membership only — no score logic here).
  async function addToRotation(rotationId: string, albumId: string) {
    await prisma.rotationAlbum.create({ data: { rotationId, albumId } });
  }

  // Closes a rotation for one album: snapshots the CUMULATIVE, all-time
  // average across every Rating this album has ever received (not just
  // ratings from this rotation's window), onto both RotationAlbum (history)
  // and Album (current public score).
  async function closeRotationForAlbum(
    rotationId: string,
    albumId: string,
    closedAt: Date
  ) {
    const agg = await prisma.rating.aggregate({
      where: { albumId },
      _avg: { score: true },
      _count: { score: true },
    });

    const ratingCount = agg._count.score;
    const averageRating = ratingCount > 0 ? agg._avg.score : null;

    await prisma.rotationAlbum.update({
      where: { rotationId_albumId: { rotationId, albumId } },
      data: { averageRating, ratingCount, closedAt },
    });
    await prisma.album.update({
      where: { id: albumId },
      data: { averageRating, ratingCount },
    });
  }

  // -------------------------------------------------------------------
  // Seed each closed rotation: add membership, rate tracks (derives
  // Rating), then close — snapshotting the cumulative public score.
  // -------------------------------------------------------------------
  for (const seed of albumSeedData) {
    const album = albumsBySlug.get(seed.slug)!;
    for (const group of seed.rotationGroups) {
      if (group === 'D') continue; // handled separately below, stays open
      const rotation = rotationsById[group];
      await addToRotation(rotation.id, album.id);
      await seedTrackRatingsOnce(album);
      await closeRotationForAlbum(rotation.id, album.id, rotation.endDate);
    }
  }

  // -------------------------------------------------------------------
  // Current, open rotation (D): RotationAlbum rows exist but stay unclosed
  // (averageRating/ratingCount/closedAt all null on RotationAlbum, and
  // Album.averageRating is left untouched — nothing public yet). A couple
  // of albums get partial, in-progress track ratings to simulate a week
  // actively in motion.
  // -------------------------------------------------------------------
  for (const seed of albumSeedData) {
    if (!seed.rotationGroups.includes('D' as never)) continue;
    const album = albumsBySlug.get(seed.slug)!;
    await addToRotation(rotationD.id, album.id);
  }

  // Revengeseekerz: alex and maya have each rated every track (so they
  // have a derived "My Score"); noah hasn't rated it yet. The album stays
  // unclosed, so Album.averageRating remains null regardless.
  await seedTrackRatingsOnce(albumsBySlug.get('revengeseekerz')!, [alex, maya]);

  // Ghostholding: only alex has rated it so far, and only partially — two
  // of its three tracks — to simulate a rating still in progress. Rated
  // directly here instead of via seedTrackRatingsOnce since that helper
  // always rates the full tracklist.
  {
    const ghostholding = albumsBySlug.get('ghostholding')!;
    trackRatedAlbumIds.add(ghostholding.id); // prevent full re-seed later
    for (const track of ghostholding.tracks.slice(0, 2)) {
      const trackRating = await prisma.trackRating.create({
        data: { userId: alex.id, trackId: track.id, score: 78 },
      });
      if (track === ghostholding.tracks[0]) {
        await prisma.comment.create({
          data: {
            body: `"${track.title}" is a great opener.`,
            authorId: alex.id,
            trackRatingId: trackRating.id,
          },
        });
      }
    }
    await recomputeUserAlbumRating(alex.id, ghostholding.id);
  }

  // Zephyr Echoes: nobody has rated it yet — left fully unrated on purpose
  // to test empty states within an open rotation.

  console.log('Seed completed successfully.');
  console.log(`Test login for any seeded user: <email> / ${SEED_PASSWORD}`);
  console.log('  alex@example.com  -> admin');
  console.log('  maya@example.com  -> moderator');
  console.log('  noah@example.com  -> user');
  console.log(
    '  zoe@example.com   -> user (unrated, useful for testing empty states)'
  );
  console.log(
    'Rotations seeded: A/B/C closed with public cumulative scores, D currently open.'
  );
  console.log(
    '"Paper Coast" appears in both rotation A and C — same single Rating row per user carries forward, not duplicated.'
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
