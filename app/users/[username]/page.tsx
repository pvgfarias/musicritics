import { notFound } from 'next/navigation';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { getUserProfileByUsername } from '@/features/users/queries';
import { FollowButton } from '@/features/follows/components/follow-button';
import RatingScore from '@/components/dashboard/rating-score';
import { FollowListDialog } from '@/features/follows/components/follow-list-dialog';
import { EditProfileButton } from '@/features/users/components/edit-profile-button';

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  if (!username) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const viewer = session?.user;

  const profile = await getUserProfileByUsername(username, viewer?.id);
  if (!profile) notFound();

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-8'>
      <div className='flex flex-row items-center gap-6'>
        <Image
          src={profile.image ?? '/user.png'}
          alt={profile.username}
          width={96}
          height={96}
          className='rounded-full'
        />
        <div className='flex flex-col gap-2 grow'>
          <div className='flex flex-col gap-2 grow'>
            <h1 className='text-3xl font-title text-gray-900 dark:text-white'>
              {profile.displayUsername ?? profile.username}
            </h1>
            {profile.bio && (
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {profile.bio}
              </p>
            )}
            <div className='flex flex-row gap-4 font-mono text-xs text-gray-500 dark:text-gray-400 uppercase items-center'>
              <span>{profile.ratingCount} ratings</span>
              <FollowListDialog
                userId={profile.id}
                followerCount={profile.followCounts.followers}
                followingCount={profile.followCounts.following}
                isOwnProfile={profile.isOwnProfile}
              />
            </div>
          </div>
        </div>

        {!profile.isOwnProfile && viewer && (
          <FollowButton
            targetUserId={profile.id}
            initiallyFollowing={profile.viewerIsFollowing}
          />
        )}

        {profile.isOwnProfile && (
          <EditProfileButton
            initial={{
              displayUsername: profile.displayUsername ?? profile.username,
              image: profile.image,
              bio: profile.bio,
              country: profile.country,
            }}
            initialFavorites={profile.favoriteAlbums}
          />
        )}
      </div>

      {profile.favoriteAlbums.length > 0 && (
        <section className='flex flex-col gap-2'>
          <h2 className='text-xl font-title text-gray-900 dark:text-white'>
            Favorite Albums
          </h2>
          <div className='flex flex-row gap-4 flex-wrap'>
            {profile.favoriteAlbums.map(album => (
              <Link key={album.id} href={`/dashboard/albums/${album.slug}`}>
                <Image
                  src={album.coverImage ?? '/albums.jpg'}
                  alt={album.title}
                  width={120}
                  height={120}
                  className='rounded-md'
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className='flex flex-col gap-2'>
        <h2 className='text-xl font-title text-gray-900 dark:text-white'>
          Recent Reviews
        </h2>
        <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />
        {profile.recentRatings.length > 0 ? (
          <ul className='flex flex-col gap-2'>
            {profile.recentRatings.map(rating => (
              <li
                key={rating.id}
                className='flex flex-row items-center gap-4 p-2 py-4'
              >
                <Image
                  src={rating.album.coverImage ?? '/albums.jpg'}
                  alt={rating.album.title}
                  width={48}
                  height={48}
                  className='rounded-md'
                />
                <div className='flex flex-col gap-1 grow'>
                  <Link
                    href={`/dashboard/albums/${rating.album.slug}`}
                    className='font-text text-gray-800 dark:text-gray-200'
                  >
                    {rating.album.title}
                  </Link>
                  {rating.comment && (
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {rating.comment.body}
                    </p>
                  )}
                </div>
                <RatingScore ratingScore={rating.score} size='md' />
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            No reviews yet.
          </p>
        )}
      </section>
    </main>
  );
}
