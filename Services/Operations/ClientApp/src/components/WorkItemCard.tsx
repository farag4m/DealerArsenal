import clsx from 'clsx'
import PriorityBadge from './PriorityBadge'
import type { WorkItem } from '../types/api'

interface WorkItemCardProps {
  item: WorkItem
  onComplete?: (id: string) => void
  onBlock?: (id: string) => void
  onSnooze?: (id: string) => void
  readOnly?: boolean
}

const TYPE_LABELS: Record<WorkItem['type'], string> = {
  vehicle_task: 'Vehicle Task',
  customer_followup: 'Follow-up',
  assigned_work: 'Assigned Work',
}

export default function WorkItemCard({
  item,
  onComplete,
  onBlock,
  onSnooze,
  readOnly = false,
}: WorkItemCardProps): React.JSX.Element {
  const isStuck =
    item.status === 'blocked' && item.stuckSince !== null

  return (
    <div
      className={clsx(
        'rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        isStuck && 'border-red-300',
        item.status === 'done' && 'opacity-60',
      )}
      data-testid="work-item-card"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
            {TYPE_LABELS[item.type]}
          </span>
          <PriorityBadge priority={item.priority} />
          {isStuck && (
            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
              Stuck
            </span>
          )}
        </div>
        {item.dueTime !== null && (
          <span className="shrink-0 text-xs text-gray-400">{item.dueTime}</span>
        )}
      </div>

      <p className="mb-1 text-sm font-medium text-gray-900">{item.title}</p>

      {(item.vehicleLabel !== null || item.customerName !== null) && (
        <p className="mb-2 text-xs text-gray-500">
          {item.vehicleLabel ?? item.customerName}
        </p>
      )}

      {!readOnly && item.status !== 'done' && (
        <div className="mt-3 flex gap-2">
          {onComplete !== undefined && (
            <button
              type="button"
              onClick={() => onComplete(item.id)}
              className="rounded px-2.5 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
              aria-label="Mark complete"
            >
              Complete
            </button>
          )}
          {onBlock !== undefined && item.status !== 'blocked' && (
            <button
              type="button"
              onClick={() => onBlock(item.id)}
              className="rounded px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              aria-label="Flag blocked"
            >
              Blocked
            </button>
          )}
          {onSnooze !== undefined && (
            <button
              type="button"
              onClick={() => onSnooze(item.id)}
              className="rounded px-2.5 py-1 text-xs font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Snooze"
            >
              Snooze
            </button>
          )}
        </div>
      )}
    </div>
  )
}
