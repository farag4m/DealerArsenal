import { useState } from 'react'
import clsx from 'clsx'
import { useBoard, useUpdateBoardStatus } from '../hooks/useBoard'
import PriorityBadge from '../components/PriorityBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import type { BoardFilters, BoardItem, WorkItemStatus, WorkItemType } from '../types/api'

const COLUMNS: { key: WorkItemStatus; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'done', label: 'Done' },
]

const COLUMN_HEADER_STYLES: Record<WorkItemStatus, string> = {
  todo: 'bg-gray-50 border-gray-200',
  in_progress: 'bg-blue-50 border-blue-200',
  blocked: 'bg-red-50 border-red-200',
  done: 'bg-green-50 border-green-200',
}

const WORK_TYPE_OPTIONS: { value: WorkItemType | ''; label: string }[] = [
  { value: '', label: 'All types' },
  { value: 'vehicle_task', label: 'Vehicle Task' },
  { value: 'customer_followup', label: 'Follow-up' },
  { value: 'assigned_work', label: 'Assigned Work' },
]

interface BoardCardProps {
  item: BoardItem
  onStatusChange: (id: string, status: WorkItemStatus) => void
}

function BoardCard({ item, onStatusChange }: BoardCardProps): React.JSX.Element {
  const isStuck = item.status === 'blocked' && item.stuckSince !== null

  return (
    <div
      className={clsx(
        'rounded-lg border bg-white p-3 shadow-sm',
        isStuck && 'border-red-300 ring-1 ring-red-200',
      )}
      data-testid="board-card"
    >
      <div className="mb-1.5 flex items-center gap-1.5 flex-wrap">
        <PriorityBadge priority={item.priority} />
        {isStuck && (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
            Stuck
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-900">{item.title}</p>
      {item.vehicleLabel !== null && (
        <p className="mt-0.5 text-xs text-gray-400">{item.vehicleLabel}</p>
      )}
      <p className="mt-1 text-xs text-gray-500">{item.assigneeName}</p>
      <select
        value={item.status}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onStatusChange(item.id, e.target.value as WorkItemStatus)
        }
        className="mt-2 w-full rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
        aria-label="Change status"
      >
        {COLUMNS.map((col) => (
          <option key={col.key} value={col.key}>
            {col.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function Board(): React.JSX.Element {
  const [filters, setFilters] = useState<Partial<BoardFilters>>({})
  const { data, isLoading, isError } = useBoard(filters)
  const updateStatus = useUpdateBoardStatus()

  const items = data?.data ?? []

  const handleWorkTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value as WorkItemType | ''
    setFilters((prev) => ({
      ...prev,
      workType: value === '' ? null : value,
    }))
  }

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.trim()
    setFilters((prev) => ({
      ...prev,
      assigneeId: value === '' ? null : value,
    }))
  }

  if (isLoading) return <LoadingSpinner message="Loading board…" />
  if (isError) return <ErrorBanner />

  return (
    <div className="px-6 py-6" data-testid="board-page">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold text-gray-900">Board</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={(filters.workType as string | null | undefined) ?? ''}
            onChange={handleWorkTypeChange}
            className="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            aria-label="Filter by work type"
          >
            {WORK_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Filter by assignee…"
            onChange={handleAssigneeChange}
            className="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            aria-label="Filter by assignee"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => {
          const colItems = items.filter((i) => i.status === col.key)
          const stuckCount = colItems.filter(
            (i) => i.status === 'blocked' && i.stuckSince !== null,
          ).length

          return (
            <div key={col.key} className="flex flex-col gap-2">
              <div
                className={clsx(
                  'flex items-center justify-between rounded-t-lg border px-3 py-2',
                  COLUMN_HEADER_STYLES[col.key],
                )}
              >
                <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-600 shadow-sm">
                    {colItems.length}
                  </span>
                  {stuckCount > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                      {stuckCount} stuck
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 min-h-[200px]">
                {colItems.map((item) => (
                  <BoardCard
                    key={item.id}
                    item={item}
                    onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
                  />
                ))}
                {colItems.length === 0 && (
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-100 py-8 text-xs text-gray-300">
                    Empty
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
