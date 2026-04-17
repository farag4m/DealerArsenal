import clsx from 'clsx';
import type { QueueSegment } from '../types';
import { SEGMENT_LABELS } from '../constants';

interface QueueTabProps {
  segment: QueueSegment;
  count: number;
  isActive: boolean;
  onSelect: (segment: QueueSegment) => void;
}

export function QueueTab({
  segment,
  count,
  isActive,
  onSelect,
}: QueueTabProps): JSX.Element {
  const handleClick = (): void => {
    onSelect(segment);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        isActive
          ? 'border-brand-600 text-brand-700'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
        segment === 'aging_alert' && isActive && 'border-orange-500 text-orange-700',
        segment === 'aging_alert' && !isActive && 'hover:border-orange-300 hover:text-orange-600',
      )}
      aria-selected={isActive}
      role="tab"
      data-testid={`queue-tab-${segment}`}
    >
      {SEGMENT_LABELS[segment]}
      <span
        className={clsx(
          'rounded-full px-2 py-0.5 text-xs font-semibold',
          isActive ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600',
          segment === 'aging_alert' && isActive && 'bg-orange-100 text-orange-700',
        )}
      >
        {count}
      </span>
    </button>
  );
}
