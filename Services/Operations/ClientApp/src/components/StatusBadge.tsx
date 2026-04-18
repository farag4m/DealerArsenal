import clsx from 'clsx'
import type { WorkItemStatus } from '../types/api'

const STATUS_STYLES: Record<WorkItemStatus, string> = {
  todo: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  blocked: 'bg-red-100 text-red-700',
  done: 'bg-green-100 text-green-700',
}

const STATUS_LABELS: Record<WorkItemStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
}

interface StatusBadgeProps {
  status: WorkItemStatus
}

export default function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
