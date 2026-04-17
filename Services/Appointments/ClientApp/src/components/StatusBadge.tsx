import { clsx } from 'clsx';
import type { AppointmentStatus } from '../api/schemas';

interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
  Scheduled: {
    label: 'Scheduled',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  Confirmed: {
    label: 'Confirmed',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  Arrived: {
    label: 'Arrived',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  Completed: {
    label: 'Completed',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  NoShow: {
    label: 'No-Show',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  Cancelled: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-500 border-gray-200 line-through',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        config.className,
      )}
      data-testid={`status-badge-${status.toLowerCase()}`}
    >
      {config.label}
    </span>
  );
}
