// components/home/features.tsx
const features = [
  {
    title: 'Rate',
    description: 'Score albums and tracks, and see how your taste compares.',
  },
  {
    title: 'Track',
    description:
      'Keep a running rotation of what you\u2019re currently listening to.',
  },
  {
    title: 'Discover',
    description:
      'Find new artists and albums through the community\u2019s ratings.',
  },
];

export default function Features() {
  return (
    <section className='px-6 py-20 max-w-5xl mx-auto'>
      <div className='grid gap-10 sm:grid-cols-3 text-center'>
        {features.map(f => (
          <div key={f.title}>
            <h3 className='text-lg font-semibold text-amber-500 mb-2'>
              {f.title}
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
