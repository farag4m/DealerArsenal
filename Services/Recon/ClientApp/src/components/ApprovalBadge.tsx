import clsx from 'clsx';
import type { ApprovalStatus } from '../types';

interface ApprovalBadgeProps {
  status: ApprovalStatus;
}

const LABEL_MAP: Record<ApprovalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  denied: 'Denied',
  more_info_requested: 'More Info Needed',
};

export function ApprovalBadge({ status }: ApprovalBadgeProps): JSX.Element {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        status === 'approved' && 'bg-green-100 text-green-800',
        status === 'denied' && 'bg-red-100 text-red-800',
        status === 'pending' && 'bg-yellow-100 text-yellow-800',
        status === 'more_info_requested' && 'bg-blue-100 text-blue-800',
      )}
      data-testid="approval-badge"
    >
      {LABEL_MAP[status]}
    </span>
  );
}
