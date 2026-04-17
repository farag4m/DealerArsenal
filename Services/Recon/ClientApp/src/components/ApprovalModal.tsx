import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ApprovalDecision } from '../types';
import { useSubmitApproval } from '../hooks';

const ApprovalFormSchema = z.object({
  decision: z.enum(['approve', 'deny', 'request_more_info'] as const),
  budget: z.number({ coerce: true }).nonnegative().optional(),
  reason: z.string().optional(),
});

type ApprovalFormValues = z.infer<typeof ApprovalFormSchema>;

interface ApprovalModalProps {
  issueId: string;
  onClose: () => void;
}

const DECISION_LABELS: Record<ApprovalDecision, string> = {
  approve: 'Approve',
  deny: 'Deny',
  request_more_info: 'Request More Info',
};

export function ApprovalModal({
  issueId,
  onClose,
}: ApprovalModalProps): JSX.Element {
  const { mutate: submitApproval, isPending } = useSubmitApproval();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApprovalFormValues>({
    resolver: zodResolver(ApprovalFormSchema),
    defaultValues: { decision: 'approve' },
  });

  const decision = watch('decision');

  const onSubmit = (values: ApprovalFormValues): void => {
    submitApproval(
      {
        issueId,
        decision: values.decision,
        budget: values.budget,
        reason: values.reason,
      },
      { onSuccess: onClose },
    );
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
      data-testid="approval-modal"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">Approval Decision</h2>

        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="mt-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Decision
            </label>
            <select
              {...register('decision')}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              data-testid="decision-select"
            >
              {(['approve', 'deny', 'request_more_info'] as ApprovalDecision[]).map(
                (d) => (
                  <option key={d} value={d}>
                    {DECISION_LABELS[d]}
                  </option>
                ),
              )}
            </select>
          </div>

          {decision === 'approve' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Approved Budget ($)
              </label>
              <input
                type="number"
                {...register('budget')}
                min={0}
                step={0.01}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                data-testid="budget-input"
              />
              {errors.budget && (
                <p className="mt-1 text-xs text-red-600">{errors.budget.message}</p>
              )}
            </div>
          )}

          {(decision === 'deny' || decision === 'request_more_info') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {decision === 'deny' ? 'Reason for Denial' : 'What info is needed?'}
              </label>
              <textarea
                {...register('reason')}
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                data-testid="reason-input"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
              data-testid="submit-approval"
            >
              {isPending ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
