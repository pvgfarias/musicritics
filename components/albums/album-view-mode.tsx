import { IconLayoutGrid, IconList } from '@tabler/icons-react';

type AlbumViewModeProps = {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
};

export default function AlbumViewMode({
  viewMode,
  onViewModeChange,
}: AlbumViewModeProps) {
  return (
    <div className='flex h-10 w-18 overflow-hidden rounded-md border border-gray-300 bg-foreground dark:border-slate-800'>
      <button
        type='button'
        onClick={() => onViewModeChange('grid')}
        className={`flex flex-1 items-center justify-center transition-colors duration-200 ${
          viewMode === 'grid' ? 'bg-ember text-gray-900' : 'text-gray-500'
        }`}
      >
        <IconLayoutGrid size={18} />
      </button>

      <button
        type='button'
        onClick={() => onViewModeChange('list')}
        className={`flex flex-1 items-center justify-center transition-colors duration-200 ${
          viewMode === 'list' ? 'bg-ember text-gray-900' : 'text-gray-500'
        }`}
      >
        <IconList size={18} />
      </button>
    </div>
  );
}
