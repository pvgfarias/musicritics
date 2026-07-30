import currentRatings from '@/data/currentRatings';

type Album = (typeof currentRatings)[number];

export default function AlbumStats({ album }: { album: Album }) {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-xl font-title tracking-wide text-gray-950 dark:text-white whitespace-nowrap underline underline-offset-16 decoration-summer-blue decoration-4 pb-8'>
        Stats
      </h1>
      <div className='flex flex-row gap-8'>
        <div className='flex flex-row gap-4 bg-white rounded-xl w-60 h-16 justify-between p-4 items-center'>
          <div className='bg-lime-200 text-lime-900 rounded-full h-10 w-10 flex justify-center items-center'>
            {album.finalGrade}
          </div>
          <h3 className='text-gray-400 text-base font-mono'>Public Rating</h3>
        </div>
        <div className='flex flex-row gap-4 bg-white rounded-xl w-60 h-16 justify-between p-4 items-center'>
          <div className='bg-red-200 text-red-900 rounded-full h-10 w-10 flex justify-center items-center'>
            {album.myGrade}
          </div>
          <h3 className='text-gray-400 text-base font-mono'>My Rating</h3>
        </div>
      </div>
    </div>
  );
}
