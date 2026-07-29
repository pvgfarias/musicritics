'use client';

import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { useState } from 'react';

export default function StarRating({
  rating,
  onRate,
  size = 16,
}: {
  rating: number;
  onRate: (value: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? rating;

  return (
    <div
      className='flex items-center gap-0.5'
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map(value => {
        const filled = value <= displayValue;
        const Icon = filled ? IconStarFilled : IconStar;
        return (
          <button
            key={value}
            type='button'
            aria-label={`Rate ${value} out of 5`}
            onMouseEnter={() => setHovered(value)}
            onClick={() => onRate(value)}
            className='p-0.5'
          >
            <Icon
              size={size}
              className={filled ? 'text-gray-900' : 'text-gray-400'}
            />
          </button>
        );
      })}
    </div>
  );
}
