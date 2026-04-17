import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Note } from '../types';
import { useAddNote } from '../hooks';

const AddNoteFormSchema = z.object({
  content: z.string().min(1, 'Note cannot be empty'),
});

type AddNoteFormValues = z.infer<typeof AddNoteFormSchema>;

interface NotesLogProps {
  issueId: string;
  notes: Note[];
}

export function NotesLog({ issueId, notes }: NotesLogProps): JSX.Element {
  const [isAdding, setIsAdding] = useState(false);
  const { mutate: addNote, isPending } = useAddNote();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddNoteFormValues>({
    resolver: zodResolver(AddNoteFormSchema),
  });

  const onSubmit = (values: AddNoteFormValues): void => {
    addNote(
      { issueId, content: values.content },
      {
        onSuccess: () => {
          reset();
          setIsAdding(false);
        },
      },
    );
  };

  return (
    <div className="space-y-4" data-testid="notes-log">
      <h3 className="text-sm font-semibold text-gray-700">Internal Notes</h3>

      {notes.length === 0 && (
        <p className="text-sm text-gray-400">No notes yet.</p>
      )}

      <ul className="space-y-3">
        {notes.map((note) => (
          <li
            key={note.id}
            className="rounded-md bg-gray-50 px-3 py-2 text-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{note.author}</span>
              <span className="text-xs text-gray-400">
                {new Date(note.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-gray-600">{note.content}</p>
          </li>
        ))}
      </ul>

      {!isAdding && (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          + Add note
        </button>
      )}

      {isAdding && (
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-2">
          <textarea
            {...register('content')}
            rows={3}
            placeholder="Write a note…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            data-testid="note-input"
          />
          {errors.content && (
            <p className="text-xs text-red-600">{errors.content.message}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
              data-testid="submit-note"
            >
              {isPending ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => { reset(); setIsAdding(false); }}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
