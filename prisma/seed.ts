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
        image: 'https://i.pravatar.cc/150?img=12',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maya@example.com',
        username: 'maya',
        name: 'Maya Ortiz',
        image: 'https://i.pravatar.cc/150?img=32',
      },
    }),
    prisma.user.create({
      data: {
        email: 'noah@example.com',
        username: 'noah',
        name: 'Noah Brooks',
        image: 'https://i.pravatar.cc/150?img=15',
      },
    }),
    prisma.user.create({
      data: {
        email: 'zoe@example.com',
        username: 'zoe',
        name: 'Zoe Kim',
        image: 'https://i.pravatar.cc/150?img=20',
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

    for (const [userIndex, user] of userPool.entries()) {
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

      for (const [index, track] of albumTracks.entries()) {
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
