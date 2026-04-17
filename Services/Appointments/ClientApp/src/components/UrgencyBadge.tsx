import { clsx } from 'clsx';
import type { AppointmentStatus } from '../api/schemas';
import { computeUrgency } from '../hooks/useUrgencyClass';

interface UrgencyBadgeProps {
  scheduledAt: string;
  status: AppointmentStatus;
}

export function UrgencyBadge({ scheduledAt, status }: UrgencyBadgeProps) {
  const level = computeUrgency(scheduledAt, status);
  if (level === 'none') return null;

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        level === 'overdue' && 'bg-red-600 text-white',
        level === 'imminent' && 'bg-orange-500 text-white',
      )}
      data-testid="urgency-badge"
    >
      {level === 'overdue' ? 'Overdue' : 'Soon'}
    </span>
  );
}
