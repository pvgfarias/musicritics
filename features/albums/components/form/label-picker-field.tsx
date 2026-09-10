'use client';

import { useState, useTransition } from 'react';
import { IconX, IconTrash, IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';
import {
  searchLabels,
  createLabel,
  deleteLabel,
} from '@/features/labels/actions';

type LabelOption = { id: string; name: string };

type Props = {
  value: LabelOption | null;
  onChange: (label: LabelOption | null) => void;
};

export function LabelPickerField({ value, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LabelOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);

  function runSearch(q: string) {
    startTransition(async () => {
      const labels = await searchLabels(q);
      setResults(labels);
    });
  }

  function handleQueryChange(q: string) {
    setQuery(q);
    runSearch(q);
  }

  function selectLabel(label: LabelOption) {
    onChange(label);
    setQuery('');
    setResults([]);
  }

  async function handleCreate() {
    const name = query.trim();
    if (!name) return;
    setIsCreating(true);
    try {
      const result = await createLabel(name);
      if (result.success) {
        selectLabel(result.label);
      } else {
        toast.error(result.error);
      }
    } finally {
      setIsCreating(false);
    }
  }

  // Deletes the Label record entirely (not just this album's association
  // — see deleteLabel's comment on why that's safe). Lives on each search
  // result rather than on the currently-selected chip, since deleting the
  // label you just picked for *this* album mid-edit is a confusing place
  // to offer that action.
  async function handleDelete(label: LabelOption, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete label "${label.name}"? This can't be undone.`)) {
      return;
    }
    const result = await deleteLabel(label.id);
    if (result.success) {
      setResults(prev => prev.filter(l => l.id !== label.id));
      toast.success(`"${label.name}" deleted`);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>Label</label>

      {value ? (
        <span className='flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800'>
          {value.name}
          <button
            type='button'
            onClick={() => onChange(null)}
            aria-label={`Remove ${value.name}`}
          >
            <IconX size={12} />
          </button>
        </span>
      ) : (
        <div className='relative'>
          <input
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            placeholder='Search labels…'
            className='w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
          />
          {query && (
            <div className='absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900'>
              {isPending ? (
                <div className='px-3 py-2 text-xs text-gray-400'>
                  Searching…
                </div>
              ) : (
                <>
                  {results.map(label => (
                    <div
                      key={label.id}
                      className='flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800'
                    >
                      <button
                        type='button'
                        onClick={() => selectLabel(label)}
                        className='flex-1 px-3 py-1.5 text-left text-sm'
                      >
                        {label.name}
                      </button>
                      <button
                        type='button'
                        onClick={e => handleDelete(label, e)}
                        aria-label={`Delete ${label.name}`}
                        className='px-2 text-gray-400 hover:text-red-600'
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                  ))}
                  {results.length === 0 && (
                    <div className='px-3 py-2 text-xs text-gray-400'>
                      No labels found
                    </div>
                  )}
                  {/* Inline creation — see the discussion in loose-ends.md
                      on why labels (unlike streaming platforms) can't be a
                      closed enum: the set grows every time an album needs
                      a label that isn't seeded yet, so the picker needs a
                      way to add one on the spot. */}
                  <button
                    type='button'
                    onClick={handleCreate}
                    disabled={isCreating}
                    className='flex w-full items-center gap-1 border-t border-gray-200 px-3 py-1.5 text-left text-sm text-ember disabled:opacity-50 dark:border-gray-700'
                  >
                    <IconPlus size={14} />
                    {isCreating ? 'Creating…' : `Create "${query.trim()}"`}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
