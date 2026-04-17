import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { StaffMember } from '../api/schemas';
import { UpdateFollowUpSchema, type UpdateFollowUpInput } from '../api/schemas';

interface FollowUpCardProps {
  followUpAction: string | null;
  followUpDueDate: string | null;
  followUpOwnerName: string | null;
  staff: StaffMember[];
  onSave: (data: UpdateFollowUpInput) => void;
  isSaving?: boolean;
}

export function FollowUpCard({
  followUpAction,
  followUpDueDate,
  followUpOwnerName,
  staff,
  onSave,
  isSaving = false,
}: FollowUpCardProps) {
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateFollowUpInput>({
    resolver: zodResolver(UpdateFollowUpSchema),
    defaultValues: {
      followUpAction: followUpAction ?? '',
      followUpDueDate: followUpDueDate ?? '',
      followUpOwnerId: '',
    },
  });

  function onSubmit(data: UpdateFollowUpInput): void {
    onSave(data);
    setEditing(false);
  }

  function handleCancel(): void {
    reset();
    setEditing(false);
  }

  const hasFollowUp = followUpAction !== null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm" data-testid="followup-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Follow-Up Ownership</h3>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 hover:underline"
            data-testid="edit-followup-btn"
          >
            {hasFollowUp ? 'Edit' : 'Set follow-up'}
          </button>
        )}
      </div>

      <div className="p-5">
        {!editing && (
          <>
            {hasFollowUp ? (
              <div className="space-y-3" data-testid="followup-display">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </span>
                  <p className="mt-1 text-sm text-slate-800">{followUpAction}</p>
                </div>
                {followUpDueDate && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Due
                    </span>
                    <p className="mt-1 text-sm text-slate-800">
                      {format(parseISO(followUpDueDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
                {followUpOwnerName && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Owner
                    </span>
                    <p className="mt-1 text-sm text-slate-800">{followUpOwnerName}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No follow-up set.</p>
            )}
          </>
        )}

        {editing && (
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4" data-testid="followup-form">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Follow-up action
              </label>
              <textarea
                {...register('followUpAction')}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Call customer to check on financing"
                data-testid="followup-action-input"
              />
              {errors.followUpAction && (
                <p className="text-xs text-red-600 mt-1">{errors.followUpAction.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due date</label>
              <input
                type="date"
                {...register('followUpDueDate')}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="followup-due-input"
              />
              {errors.followUpDueDate && (
                <p className="text-xs text-red-600 mt-1">{errors.followUpDueDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assigned to</label>
              <select
                {...register('followUpOwnerId')}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="followup-owner-select"
              >
                <option value="">Select staff member…</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.followUpOwnerId && (
                <p className="text-xs text-red-600 mt-1">{errors.followUpOwnerId.message}</p>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                data-testid="save-followup-btn"
              >
                {isSaving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-white text-slate-600 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
