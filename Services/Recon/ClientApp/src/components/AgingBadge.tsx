import clsx from 'clsx';
import { AGING_THRESHOLD_DAYS } from '../constants';

interface AgingBadgeProps {
  daysInRecon: number;
}

export function AgingBadge({ daysInRecon }: AgingBadgeProps): JSX.Element {
  const isAging = daysInRecon >= AGING_THRESHOLD_DAYS;
  const isCritical = daysInRecon >= AGING_THRESHOLD_DAYS * 2;

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        isCritical && 'bg-red-100 text-red-800',
        isAging && !isCritical && 'bg-orange-100 text-orange-800',
        !isAging && 'bg-green-100 text-green-800',
      )}
      data-testid="aging-badge"
    >
      {daysInRecon}d
    </span>
  );
}
